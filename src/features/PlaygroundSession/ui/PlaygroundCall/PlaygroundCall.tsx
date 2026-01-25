import { memo, useEffect, useRef, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PlaygroundCall.module.scss'

interface PlaygroundCallProps {
    className?: string
    events: any[]
    analyserNode?: AnalyserNode
    status: string
    assistantName?: string
}

export const PlaygroundCall = memo((props: PlaygroundCallProps) => {
    const { className, events, analyserNode, status, assistantName } = props
    const { t } = useTranslation('playground')
    const canvasRef = useRef<HTMLCanvasElement>(null)



    // Process Events to determine current text
    // Optimization: Use incremental processing to avoid O(N) iteration on every render
    const cacheRef = useRef<{
        itemsMap: Map<string, { role: string, text: string }>
        lastItemId: string | null
        processedCount: number
    }>({
        itemsMap: new Map(),
        lastItemId: null,
        processedCount: 0
    })

    // Text Sync State
    const [revealedLength, setRevealedLength] = useState(0)
    const revealedLengthRef = useRef(0)


    const { currentText, currentRole, currentItemId } = useMemo(() => {
        const cache = cacheRef.current

        // Check if events array was reset/cleared
        if (events.length < cache.processedCount) {
            cache.itemsMap.clear()
            cache.lastItemId = null
            cache.processedCount = 0
        }

        // Process only new events
        for (let i = cache.processedCount; i < events.length; i++) {
            const e = events[i]
            const itemsMap = cache.itemsMap

            // User Item Creation
            if (e.type === 'conversation.item.created') {
                const item = e.item
                if (item && item.role === 'user') {
                    itemsMap.set(item.id, {
                        role: 'user',
                        text: item.content?.[0]?.text || item.content?.[0]?.transcript || '',
                    })
                    cache.lastItemId = item.id
                }
            }

            // User Transcription Update
            if (e.type === 'conversation.item.input_audio_transcription.completed') {
                if (e.item_id) {
                    const text = e.transcript || ''
                    if (itemsMap.has(e.item_id)) {
                        itemsMap.get(e.item_id)!.text = text
                    } else {
                        itemsMap.set(e.item_id, { role: 'user', text })
                        cache.lastItemId = e.item_id
                    }
                }
            }

            // User Audio Committed (before transcription completes)
            if (e.type === 'input_audio_buffer.committed') {
                if (e.item_id) {
                    // Create placeholder for user text while waiting for transcription
                    if (!itemsMap.has(e.item_id)) {
                        itemsMap.set(e.item_id, { role: 'user', text: '' })
                        cache.lastItemId = e.item_id
                    }
                }
            }

            // User Transcription Delta (real-time)
            if (e.type === 'conversation.item.input_audio_transcription.delta') {
                if (e.item_id) {
                    const delta = e.delta || ''
                    if (itemsMap.has(e.item_id)) {
                        itemsMap.get(e.item_id)!.text += delta
                    } else {
                        itemsMap.set(e.item_id, { role: 'user', text: delta })
                        cache.lastItemId = e.item_id
                    }
                }
            }

            // Assistant Response
            if (e.type === 'response.output_item.added') {
                const item = e.item
                if (item) {
                    itemsMap.set(item.id, {
                        role: item.type === 'function_call' ? 'function' : (item.role || 'assistant'),
                        text: item.content?.[0]?.text || '',
                    })
                    cache.lastItemId = item.id
                }
            }

            // Stream Deltas
            if (e.type === 'response.text.delta' || e.type === 'response.audio_transcript.delta') {
                if (e.item_id) {
                    const delta = e.delta || ''
                    if (itemsMap.has(e.item_id)) {
                        itemsMap.get(e.item_id)!.text += delta
                    } else {
                        itemsMap.set(e.item_id, { role: 'assistant', text: delta })
                        cache.lastItemId = e.item_id
                    }
                }
            }

            // Function Call Arguments
            if (e.type === 'response.function_call_arguments.delta') {
                if (e.item_id) {
                    const delta = e.delta || ''
                    if (itemsMap.has(e.item_id)) {
                        const item = itemsMap.get(e.item_id)!
                        item.role = 'function'
                        item.text += delta
                    } else {
                        itemsMap.set(e.item_id, { role: 'function', text: delta })
                        cache.lastItemId = e.item_id
                    }
                }
            }
        }

        cache.processedCount = events.length

        // Show Active Item if exists
        if (cache.lastItemId && cache.itemsMap.has(cache.lastItemId)) {
            const item = cache.itemsMap.get(cache.lastItemId)!
            return {
                currentText: item.text || '',
                currentRole: item.role as any,
                currentItemId: cache.lastItemId
            }
        }

        // Default - empty
        return { currentText: '', currentRole: 'system', currentItemId: null }

    }, [events])

    // Refs for synchronization in animation loop
    const syncStateRef = useRef({
        text: currentText,
        role: currentRole as string,
        itemId: currentItemId as string | null
    })

    useEffect(() => {
        syncStateRef.current = { text: currentText, role: currentRole, itemId: currentItemId }

        // Reset reveal if item changed
        if (currentItemId !== syncStateRef.current.itemId) {
            // Logic handled in draw loop via delta check, but better explicit here?
            // Actually, refs update immediately.
        }
    }, [currentText, currentRole, currentItemId])

    // Visualizer & Text Sync Loop
    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        // We continue even if no ctx to keep text logic running?
        // But if no canvas, component is likely not visible.
        // Assuming canvas always exists.

        let animationId: number
        let lastItemIdProcessed: string | null = null

        // Audio Data
        let dataArray: Uint8Array | null = null
        if (analyserNode) {
            const bufferLength = analyserNode.frequencyBinCount
            dataArray = new Uint8Array(bufferLength)
        }

        const draw = () => {
            animationId = requestAnimationFrame(draw)

            if (analyserNode && dataArray) {
                analyserNode.getByteFrequencyData(dataArray as any)
            }

            const { text, role, itemId } = syncStateRef.current

            // -- 1. Text Synchronization Logic --
            if (itemId !== lastItemIdProcessed) {
                // New item, reset
                lastItemIdProcessed = itemId
                revealedLengthRef.current = 0
                setRevealedLength(0)
            }

            if (role === 'user') {
                // User text appears immediately
                if (revealedLengthRef.current !== text.length) {
                    revealedLengthRef.current = text.length
                    setRevealedLength(text.length)
                }
            } else {
                // Assistant text: Typewriter effect synced with audio
                const currentLen = revealedLengthRef.current
                const targetLen = text.length

                if (currentLen < targetLen) {
                    let speed = 0.5 // Base speed (chars per frame) ~30 chars/sec

                    // Modulate by audio volume if available
                    if (analyserNode && dataArray) {
                        // Data already updated at top of frame
                        // Calculate average volume
                        let sum = 0
                        for (let i = 0; i < dataArray.length; i++) {
                            sum += dataArray[i]
                        }
                        const avg = sum / dataArray.length // 0 - 255

                        // If silent (volume < 5), slow down or stop
                        if (avg < 5) {
                            speed = 0.1 // Crawl very slowly during pauses
                        } else {
                            // Boost speed slightly with volume
                            speed = 0.3 + (avg / 255) * 1.0 // 0.3 to 1.3
                        }
                    }

                    revealedLengthRef.current += speed
                    if (revealedLengthRef.current > targetLen) {
                        revealedLengthRef.current = targetLen
                    }

                    // Only update state if integer part changes
                    const nextInteger = Math.floor(revealedLengthRef.current)
                    setRevealedLength((prev: number) => {
                        if (nextInteger !== prev) return nextInteger
                        return prev
                    })
                }
            }

            // -- 2. Visualizer Drawing --
            if (ctx && canvas) {
                const width = canvas.width
                const height = canvas.height

                ctx.clearRect(0, 0, width, height)

                if (analyserNode && dataArray) {
                    // Update data again if not done in text logic
                    // analyserNode.getByteFrequencyData(dataArray) // Already done above if present

                    // Draw visualizer
                    const bufferLength = dataArray.length
                    const barWidth = (width / bufferLength) * 2.5
                    let barHeight
                    let x = 0

                    // Gradient settings
                    const gradient = ctx.createLinearGradient(0, 0, 0, height)
                    gradient.addColorStop(0, 'rgba(0, 255, 170, 0.8)') // Cyan/Greenish
                    gradient.addColorStop(1, 'rgba(0, 150, 255, 0.0)')

                    ctx.fillStyle = gradient

                    // Clear black bg
                    ctx.fillStyle = '#000'
                    ctx.fillRect(0, 0, width, height)

                    const cx = width / 2
                    const cy = height / 2

                    ctx.beginPath()
                    ctx.strokeStyle = 'rgba(0, 220, 255, 0.5)'
                    ctx.lineWidth = 2

                    x = 0

                    // Draw generic frequency bars
                    for (let i = 0; i < bufferLength; i++) {
                        barHeight = dataArray[i] / 2

                        // Mirror up and down
                        ctx.fillStyle = `rgba(50, 150, 255, ${barHeight / 200})`
                        ctx.fillRect(x, cy - barHeight, barWidth, barHeight * 2)

                        x += barWidth + 1
                    }
                }
            }
        }

        draw()

        return () => {
            cancelAnimationFrame(animationId)
        }
    }, [analyserNode])

    // Status text
    const statusText = useMemo(() => {
        if (status === 'connecting') return t('connecting')
        if (status === 'connected') return t('liveSession')
        return t('disconnected')
    }, [status, t])

    // Format text to show only a window of the last characters if too long
    // Format text to show only a window of the last characters if too long
    const displayedText = useMemo(() => {
        // Use revealedLength to slice the currentText
        const textToDisplay = currentText.slice(0, revealedLength)

        const maxLength = 150 // Increased window size
        if (textToDisplay.length <= maxLength) return textToDisplay

        // Slide the window
        const tail = textToDisplay.slice(-maxLength)
        const firstSpace = tail.indexOf(' ')
        if (firstSpace > 0 && firstSpace < 20) {
            return '...' + tail.slice(firstSpace + 1)
        }
        return '...' + tail
    }, [currentText, revealedLength])

    return (
        <div className={classNames(cls.PlaygroundCall, {}, [className])}>
            <canvas ref={canvasRef} className={cls.canvas} />

            <div className={cls.status}>{statusText} {assistantName && t('with', { name: assistantName })}</div>

            <div className={cls.content}>
                <div className={classNames(cls.text, {}, [cls[currentRole]])}>
                    {displayedText}
                </div>
            </div>

        </div>
    )
})
