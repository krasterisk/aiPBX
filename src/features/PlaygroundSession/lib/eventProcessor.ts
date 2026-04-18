/**
 * Pure event processor — converts PlaygroundEvents into TranscriptItems and SessionMetrics.
 *
 * This is the core data transformation logic, extracted from PlaygroundCall's
 * inline useMemo for testability and reuse (live mode + replay mode).
 */
import { PlaygroundEvent } from '../model/types/playgroundEvent'
import { TranscriptItem, TranscriptRole, createTranscriptItem } from '../model/types/transcriptItem'
import { SessionMetrics, createInitialMetrics, VadState } from '../model/types/sessionMetrics'

export interface ProcessorState {
    transcript: TranscriptItem[]
    metrics: SessionMetrics
    vadState: VadState
    /** Timestamp of last user speech_stopped (for latency calc) */
    lastSpeechStoppedAt: number | null
    /** Timestamp of first assistant delta after speech_stopped */
    lastResponseStartedAt: number | null
}

export function createInitialProcessorState(): ProcessorState {
    return {
        transcript: [],
        metrics: createInitialMetrics(),
        vadState: 'idle',
        lastSpeechStoppedAt: null,
        lastResponseStartedAt: null,
    }
}

/**
 * Process a single event and return updated state.
 * Pure function — no side effects.
 */
export function processEvent(state: ProcessorState, event: PlaygroundEvent): ProcessorState {
    // Clone top-level to avoid mutation (transcript items are mutated in-place for perf)
    const next: ProcessorState = {
        ...state,
        transcript: [...state.transcript],
        metrics: { ...state.metrics },
    }

    const { type, timestamp } = event

    switch (type) {
        // --- User speech ---
        case 'input_audio_buffer.speech_started':
            next.vadState = 'listening'
            next.metrics.vadEvents = [...next.metrics.vadEvents, { type: 'speech_started', timestamp }]
            break

        case 'input_audio_buffer.speech_stopped':
            next.vadState = 'idle'
            next.lastSpeechStoppedAt = timestamp
            next.metrics.vadEvents = [...next.metrics.vadEvents, { type: 'speech_stopped', timestamp }]
            break

        case 'input_audio_buffer.committed':
            if (event.item_id) {
                upsertTranscriptItem(next.transcript, event.item_id, 'user', '', timestamp)
            }
            break

        // --- User item creation ---
        case 'conversation.item.created': {
            const item = event.item
            if (item && item.role === 'user') {
                const text = item.content?.[0]?.text || item.content?.[0]?.transcript || ''
                upsertTranscriptItem(next.transcript, item.id, 'user', text, timestamp)
            }
            break
        }

        // --- User transcription ---
        case 'conversation.item.input_audio_transcription.completed':
            if (event.item_id) {
                const existing = findItem(next.transcript, event.item_id)
                if (existing) {
                    existing.text = event.transcript || ''
                    existing.isStreaming = false
                } else {
                    const item = createTranscriptItem(event.item_id, 'user', event.transcript || '', timestamp)
                    item.isStreaming = false
                    next.transcript.push(item)
                }
            }
            break

        case 'conversation.item.input_audio_transcription.delta':
            if (event.item_id) {
                appendDelta(next.transcript, event.item_id, 'user', event.delta || '', timestamp)
            }
            break

        // --- Assistant response ---
        case 'response.created':
            next.vadState = 'speaking'
            break

        case 'response.output_item.added': {
            const item = event.item
            if (item) {
                const role: TranscriptRole = item.type === 'function_call' ? 'function' : 'assistant'
                const newItem = createTranscriptItem(item.id, role, '', timestamp)
                if (role === 'function') {
                    newItem.functionName = item.name
                    newItem.callId = item.call_id
                }
                next.transcript.push(newItem)

                // Latency tracking: first assistant item after user speech
                if (role === 'assistant' && next.lastSpeechStoppedAt && !next.lastResponseStartedAt) {
                    next.lastResponseStartedAt = timestamp
                    const latency = timestamp - next.lastSpeechStoppedAt

                    // First response ever?
                    if (next.metrics.firstResponseLatencyMs === null) {
                        next.metrics.firstResponseLatencyMs = latency
                    }

                    next.metrics.responseTimes = [...next.metrics.responseTimes, latency]
                    const sum = next.metrics.responseTimes.reduce((a, b) => a + b, 0)
                    next.metrics.avgResponseLatencyMs = Math.round(sum / next.metrics.responseTimes.length)
                }
            }
            break
        }

        // --- Streaming text/transcript deltas ---
        case 'response.text.delta':
        case 'response.audio_transcript.delta':
            if (event.item_id) {
                const raw = event._raw as any
                const deltaStr = event.delta || event.transcript || raw?.delta || raw?.transcript || ''
                if (deltaStr) {
                    appendDelta(next.transcript, event.item_id, 'assistant', deltaStr, timestamp)
                }
            }
            break

        case 'response.text.done':
        case 'response.audio_transcript.done':
            if (event.item_id) {
                const existing = findItem(next.transcript, event.item_id)
                if (existing) {
                    existing.isStreaming = false
                    const raw = event._raw as any
                    const transcriptStr = event.transcript || raw?.transcript || ''
                    if (transcriptStr) {
                        existing.text = transcriptStr
                    }
                }
            }
            break

        // --- Function call ---
        case 'response.function_call_arguments.delta':
            if (event.item_id) {
                const existing = findItem(next.transcript, event.item_id)
                if (existing) {
                    existing.functionArgs = (existing.functionArgs || '') + (event.delta || '')
                    existing.isStreaming = true
                } else {
                    const item = createTranscriptItem(event.item_id, 'function', '', timestamp)
                    item.functionArgs = event.delta || ''
                    next.transcript.push(item)
                }
            }
            break

        case 'response.function_call_arguments.done':
            if (event.item_id) {
                const existing = findItem(next.transcript, event.item_id)
                if (existing) {
                    existing.isStreaming = false
                    if (event.name) existing.functionName = event.name
                }
                next.metrics.functionCallCount += 1
            }
            break

        // --- Response completion ---
        case 'response.done':
            next.vadState = 'idle'
            next.metrics.turnCount += 1
            next.lastSpeechStoppedAt = null
            next.lastResponseStartedAt = null

            // Extract token usage
            if (event.usage) {
                next.metrics.totalTokensIn += event.usage.input_tokens || 0
                next.metrics.totalTokensOut += event.usage.output_tokens || 0
            }
            break

        case 'response.output_item.done': {
            if (event.item_id) {
                const existing = findItem(next.transcript, event.item_id)
                if (existing) {
                    existing.isStreaming = false
                    const item = event.item || (event._raw as any)?.item
                    if (item?.content && Array.isArray(item.content)) {
                        const fullText = item.content.map((c: any) => c.transcript || c.text || '').join('')
                        if (fullText && existing.text !== fullText) {
                            existing.text = fullText
                        }
                    }
                }
            }
            break
        }

        // --- Content part events (fallback if deltas are missing) ---
        case 'response.content_part.done' as any: {
            if (event.item_id) {
                const existing = findItem(next.transcript, event.item_id)
                if (existing) {
                    const raw = event._raw as any
                    if (raw?.part) {
                        const partText = raw.part.transcript || raw.part.text || ''
                        if (partText && existing.text !== partText) {
                            existing.text = existing.text && existing.text.length >= partText.length ? existing.text : partText
                        }
                    }
                }
            }
            break
        }

        case 'response.content_part.delta' as any: {
            if (event.item_id) {
                const raw = event._raw as any
                const deltaStr = event.delta || raw?.delta?.transcript || raw?.delta?.text || ''
                if (deltaStr) {
                    appendDelta(next.transcript, event.item_id, 'assistant', deltaStr, timestamp)
                }
            }
            break
        }

        // --- Non-realtime pipeline events ---
        case 'stt.started':
            next.vadState = 'listening'
            break

        case 'stt.completed':
            if (event.item_id) {
                upsertTranscriptItem(next.transcript, event.item_id, 'user', event.transcript || '', timestamp)
                const item = findItem(next.transcript, event.item_id)
                if (item) item.isStreaming = false
            }
            next.lastSpeechStoppedAt = timestamp
            break

        case 'llm.started':
            next.vadState = 'speaking'
            break

        case 'llm.delta':
            if (event.item_id) {
                appendDelta(next.transcript, event.item_id, 'assistant', event.delta || '', timestamp)

                // Latency tracking for non-realtime
                if (next.lastSpeechStoppedAt && !next.lastResponseStartedAt) {
                    next.lastResponseStartedAt = timestamp
                    const latency = timestamp - next.lastSpeechStoppedAt
                    if (next.metrics.firstResponseLatencyMs === null) {
                        next.metrics.firstResponseLatencyMs = latency
                    }
                    next.metrics.responseTimes = [...next.metrics.responseTimes, latency]
                    const sum = next.metrics.responseTimes.reduce((a, b) => a + b, 0)
                    next.metrics.avgResponseLatencyMs = Math.round(sum / next.metrics.responseTimes.length)
                }
            }
            break

        case 'llm.completed':
            if (event.item_id) {
                const existing = findItem(next.transcript, event.item_id)
                if (existing) existing.isStreaming = false
            }
            next.metrics.turnCount += 1
            if (event.usage) {
                next.metrics.totalTokensIn += event.usage.input_tokens || 0
                next.metrics.totalTokensOut += event.usage.output_tokens || 0
            }
            break

        case 'tts.started':
            break

        case 'tts.completed':
            next.vadState = 'idle'
            next.lastSpeechStoppedAt = null
            next.lastResponseStartedAt = null
            break

        // --- Errors ---
        case 'error':
            // Add system message to transcript
            next.transcript.push(createTranscriptItem(
                `error-${timestamp}`,
                'system',
                event.error?.message || 'Unknown error',
                timestamp
            ))
            break

        default:
            // Unknown event types are ignored in processing but still logged in event log
            break
    }

    return next
}

/**
 * Process a batch of events (for replay mode or catch-up).
 */
export function processEvents(
    initialState: ProcessorState,
    events: PlaygroundEvent[]
): ProcessorState {
    return events.reduce(processEvent, initialState)
}

// --- Helpers ---

function findItem(transcript: TranscriptItem[], itemId: string): TranscriptItem | undefined {
    return transcript.find(t => t.id === itemId)
}

function upsertTranscriptItem(
    transcript: TranscriptItem[],
    itemId: string,
    role: TranscriptRole,
    text: string,
    timestamp: number
): void {
    const existing = findItem(transcript, itemId)
    if (existing) {
        if (text) existing.text = text
    } else {
        transcript.push(createTranscriptItem(itemId, role, text, timestamp))
    }
}

function appendDelta(
    transcript: TranscriptItem[],
    itemId: string,
    role: TranscriptRole,
    delta: string,
    timestamp: number
): void {
    const existing = findItem(transcript, itemId)
    if (existing) {
        existing.text += delta
        existing.isStreaming = true
    } else {
        const item = createTranscriptItem(itemId, role, delta, timestamp)
        item.isStreaming = true
        transcript.push(item)
    }
}
