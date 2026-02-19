import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'react-toastify'
import { AUDIO_WORKLET_CODE } from '../lib/audioWorklet'
import { getWsUrl } from '@/shared/lib/domain'

const SAMPLE_RATE = 24000  // PCM16 from OpenAI Realtime API works at 24kHz
const INITIAL_BUFFER_DELAY = 0.15 // 150ms buffering
const RECONNECT_DELAY = 1000

interface UsePlaygroundSessionProps {
    onConnect?: () => void
    onDisconnect?: () => void
    onError?: (error: string) => void
}

export const usePlaygroundSession = (props?: UsePlaygroundSessionProps) => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle')
    const [isMicAccessGranted, setIsMicAccessGranted] = useState(false)
    const [events, setEvents] = useState<any[]>([])
    const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null)

    const socketRef = useRef<Socket | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const audioWorkletNodeRef = useRef<AudioWorkletNode | null>(null)
    const mediaStreamRef = useRef<MediaStream | null>(null)

    // Event batching to prevent main thread blocking on high load
    const eventBufferRef = useRef<any[]>([])

    // Keep refs to props to avoid stale closures in socket listeners
    const propsRef = useRef(props)
    useEffect(() => {
        propsRef.current = props
    }, [props])

    // Playback state
    const nextStartTimeRef = useRef<number>(0)
    const activeSourcesRef = useRef<AudioBufferSourceNode[]>([])
    const isPlayingRef = useRef<boolean>(false)

    // Flush events periodically
    useEffect(() => {
        const interval = setInterval(() => {
            if (eventBufferRef.current.length > 0) {
                const batch = eventBufferRef.current
                eventBufferRef.current = []

                setEvents(prev => {
                    // Limit history to last 500 events to prevent memory leak
                    const MAX_EVENTS = 500
                    const next = [...prev, ...batch]
                    if (next.length > MAX_EVENTS) {
                        return next.slice(next.length - MAX_EVENTS)
                    }
                    return next
                })
            }
        }, 100) // Update UI at 10fps max
        return () => clearInterval(interval)
    }, [])

    // Helper to stop all audio
    const interruptPlayback = useCallback(() => {
        activeSourcesRef.current.forEach(source => {
            try {
                source.stop()
            } catch (e) {
                // ignore already stopped
            }
        })
        activeSourcesRef.current = []
        isPlayingRef.current = false

        // Reset scheduling pointer to "now" (or slightly future) so we don't schedule in the past
        if (audioContextRef.current) {
            nextStartTimeRef.current = audioContextRef.current.currentTime
        }
    }, [])

    const cleanupAudio = useCallback(() => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop())
            mediaStreamRef.current = null
        }
        if (audioWorkletNodeRef.current) {
            audioWorkletNodeRef.current.disconnect()
            audioWorkletNodeRef.current = null
        }
        if (audioContextRef.current) {
            audioContextRef.current.close()
            audioContextRef.current = null
        }
        analyserRef.current = null
        setAnalyserNode(null)
        interruptPlayback()
        setIsMicAccessGranted(false)
        setEvents([])
        eventBufferRef.current = []
    }, [interruptPlayback])

    const playAudioChunk = useCallback((arrayBuffer: ArrayBuffer) => {
        const ctx = audioContextRef.current
        if (!ctx) return

        // 1. Decode PCM16 -> Float32
        const int16 = new Int16Array(arrayBuffer)
        const float32 = new Float32Array(int16.length)
        for (let i = 0; i < int16.length; i++) {
            float32[i] = int16[i] >= 0 ? int16[i] / 32767 : int16[i] / 32768
        }

        // 2. Create Buffer
        const audioBuffer = ctx.createBuffer(1, float32.length, SAMPLE_RATE)
        audioBuffer.copyToChannel(float32, 0)

        // 3. Schedule "Jitter Buffer" logic
        const currentTime = ctx.currentTime
        // If we fell behind (buffer empty or network lag), reset start time to "now" + small buffer
        if (nextStartTimeRef.current < currentTime) {
            nextStartTimeRef.current = currentTime + INITIAL_BUFFER_DELAY
        }

        const source = ctx.createBufferSource()
        source.buffer = audioBuffer
        source.connect(ctx.destination)

        if (analyserRef.current) {
            source.connect(analyserRef.current)
        }

        source.start(nextStartTimeRef.current)
        nextStartTimeRef.current += audioBuffer.duration

        // Keep track for interrupt
        source.onended = () => {
            activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source)
        }
        activeSourcesRef.current.push(source)
    }, [])

    // Initialize Audio Input (Mic) -> Worklet -> Socket
    const initAudioInput = useCallback(async (socket: Socket, selectedMicId?: string) => {
        try {
            // Get Mic Stream FIRST to know its native sample rate
            // Note: Browser may ignore sampleRate request and use hardware native rate (usually 48kHz)
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    deviceId: selectedMicId ? { exact: selectedMicId } : undefined,
                    channelCount: 1,
                    // Request 24kHz, but browser may use native rate
                    sampleRate: SAMPLE_RATE,
                    // specific constraints for voice
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            })
            mediaStreamRef.current = stream

            // Get actual sample rate from the stream
            const audioTrack = stream.getAudioTracks()[0]
            const settings = audioTrack.getSettings()
            const actualSampleRate = settings.sampleRate || 48000

            console.log(`[Audio] Requested: ${SAMPLE_RATE}Hz, Actual: ${actualSampleRate}Hz`)

            // Create AudioContext with THE SAME sample rate as the stream
            // This prevents the "different sample-rate" error
            const ctx = new window.AudioContext({ sampleRate: actualSampleRate })
            audioContextRef.current = ctx

            // Helper to resume context if suspended (policy)
            if (ctx.state === 'suspended') {
                await ctx.resume()
            }

            // Load worklet with resampling capability
            const blob = new Blob([AUDIO_WORKLET_CODE], { type: 'application/javascript' })
            const workletUrl = URL.createObjectURL(blob)
            await ctx.audioWorklet.addModule(workletUrl)

            // Analyser Setup
            const analyser = ctx.createAnalyser()
            analyser.fftSize = 512
            analyserRef.current = analyser
            setAnalyserNode(analyser)

            // Create MediaStreamSource - now with matching sample rate
            const source = ctx.createMediaStreamSource(stream)

            // Create worklet with resampling parameters
            const worklet = new AudioWorkletNode(ctx, 'audio-input-processor', {
                processorOptions: {
                    targetSampleRate: SAMPLE_RATE,  // 24kHz for OpenAI
                    sourceSampleRate: actualSampleRate  // Native rate
                }
            })

            worklet.port.onmessage = (event) => {
                // Send resampled Int16 buffer (24kHz)
                socket.emit('playground_audio', event.data.buffer)
            }

            // Connect graph
            // source -> worklet -> (silent destination to keep alive)
            source.connect(worklet)
            source.connect(analyser)

            // Mute output of mic to avoid self-loop
            const gain = ctx.createGain()
            gain.gain.value = 0
            worklet.connect(gain).connect(ctx.destination)

            audioWorkletNodeRef.current = worklet
            setIsMicAccessGranted(true)

        } catch (e: any) {
            console.error('Audio Init Failed:', e)
            toast.error('Microphone initialization failed: ' + e.message)
            cleanupAudio()
            throw e
        }
    }, [cleanupAudio])

    const connect = useCallback((assistantId: string, micDeviceId?: string) => {
        if (socketRef.current) return

        setStatus('connecting')

        const wsUrl = getWsUrl()
        // Note: process.env.wsUrl usage depends on build system setup (e.g. webpack DefinePlugin)

        const socket = io(wsUrl, {
            path: '/socket.io/', // Standard
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: RECONNECT_DELAY
        })
        socketRef.current = socket

        socket.on('connect', () => {
            console.log('Playground Socket Connected')
            socket.emit('playground_init', { assistantId })
        })

        socket.on('playground.ready', async () => {
            console.log('Playground Session Ready')
            setStatus('connected')
            try {
                await initAudioInput(socket, micDeviceId)
                propsRef.current?.onConnect?.()
                toast.success('Сессия установлена')
            } catch (e) {
                // If audio fails, we should disconnect
                socket.disconnect()
            }
        })

        socket.on('playground.audio_out', (data: ArrayBuffer) => {
            playAudioChunk(data)
        })

        socket.on('playground.event', (event: any) => {
            // Send to buffer instead of direct state update
            eventBufferRef.current.push(event)
        })

        socket.on('playground.interrupt', () => {
            console.warn('AI Interrupt')
            interruptPlayback()
            propsRef.current?.onError?.('AI Interrupt')
        })

        socket.on('disconnect', () => {
            console.log('Playground Socket Disconnected')
            cleanupAudio()
            setStatus('idle')
            socketRef.current = null
            propsRef.current?.onDisconnect?.()
        })

        socket.on('connect_error', (err) => {
            console.error('Socket Connect Error:', err)
            // Ideally we retry or show status
            // toast.error('Connection error')
        })

    }, [cleanupAudio, initAudioInput, interruptPlayback, playAudioChunk])

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.emit('playground_stop')
            socketRef.current.disconnect()
        }
        cleanupAudio()
        setStatus('idle')
    }, [cleanupAudio])

    useEffect(() => {
        return () => {
            disconnect()
        }
    }, [disconnect])

    // Memoize return value to allow optimization in parent
    return useMemo(() => ({
        status,
        connect,
        disconnect,
        isMicAccessGranted,
        events,
        analyserNode
    }), [status, connect, disconnect, isMicAccessGranted, events, analyserNode])
}
