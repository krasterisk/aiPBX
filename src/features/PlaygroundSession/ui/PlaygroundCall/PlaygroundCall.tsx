import { memo, useEffect, useRef, useMemo } from 'react'
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

    // Visualizer Loop
    useEffect(() => {
        if (!canvasRef.current || !analyserNode) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const bufferLength = analyserNode.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        let animationId: number

        const draw = () => {
            animationId = requestAnimationFrame(draw)
            analyserNode.getByteFrequencyData(dataArray)

            const width = canvas.width
            const height = canvas.height

            ctx.clearRect(0, 0, width, height)

            // Draw visualizer
            const barWidth = (width / bufferLength) * 2.5
            let barHeight
            let x = 0

            // Gradient settings
            const gradient = ctx.createLinearGradient(0, 0, 0, height)
            gradient.addColorStop(0, 'rgba(0, 255, 170, 0.8)') // Cyan/Greenish
            gradient.addColorStop(1, 'rgba(0, 150, 255, 0.0)')

            ctx.fillStyle = gradient

            // Center mirrored visualization
            // We'll use a simplified approach for aesthetics: just draw some bars
            // Better: waveform style (connect points)
            // Let's do a symmetric bar graph from center vertically

            // Clear
            ctx.fillStyle = '#000'
            ctx.fillRect(0, 0, width, height)

            const cx = width / 2
            const cy = height / 2

            ctx.beginPath()
            ctx.strokeStyle = 'rgba(0, 220, 255, 0.5)'
            ctx.lineWidth = 2

            const sliceWidth = width / bufferLength
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

        draw()

        return () => {
            cancelAnimationFrame(animationId)
        }
    }, [analyserNode])

    // Canvas resizer
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = canvasRef.current.offsetWidth
                canvasRef.current.height = canvasRef.current.offsetHeight
            }
        }
        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

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

    const { currentText, currentRole } = useMemo(() => {
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
            return { currentText: item.text || '', currentRole: item.role as any }
        }

        // Default - empty
        return { currentText: '', currentRole: 'system' }

    }, [events])

    // Status text
    const statusText = useMemo(() => {
        if (status === 'connecting') return t('connecting')
        if (status === 'connected') return t('liveSession')
        return t('disconnected')
    }, [status, t])

    // Format text to show only a window of the last characters if too long
    const displayedText = useMemo(() => {
        const maxLength = 200
        if (currentText.length <= maxLength) return currentText

        const tail = currentText.slice(-maxLength)
        // Try to cut at the first space to avoid chopping words
        const firstSpace = tail.indexOf(' ')
        if (firstSpace > 0 && firstSpace < 50) {
            return '...' + tail.slice(firstSpace + 1)
        }
        return '...' + tail
    }, [currentText])

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
