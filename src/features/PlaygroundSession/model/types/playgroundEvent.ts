/**
 * Typed event definitions for OpenAI Realtime API events
 * and non-realtime pipeline events flowing through the Playground.
 */

// --- Realtime API event types ---
export type RealtimeEventType =
    | 'session.created'
    | 'session.updated'
    | 'conversation.item.created'
    | 'conversation.item.input_audio_transcription.completed'
    | 'conversation.item.input_audio_transcription.delta'
    | 'input_audio_buffer.committed'
    | 'input_audio_buffer.speech_started'
    | 'input_audio_buffer.speech_stopped'
    | 'response.created'
    | 'response.output_item.added'
    | 'response.output_item.done'
    | 'response.text.delta'
    | 'response.text.done'
    | 'response.audio.delta'
    | 'response.audio.done'
    | 'response.audio_transcript.delta'
    | 'response.audio_transcript.done'
    | 'response.function_call_arguments.delta'
    | 'response.function_call_arguments.done'
    | 'response.done'
    | 'error'

// --- Non-realtime pipeline event types ---
export type NonRealtimeEventType =
    | 'stt.started'
    | 'stt.completed'
    | 'llm.started'
    | 'llm.delta'
    | 'llm.completed'
    | 'tts.started'
    | 'tts.completed'

export type PlaygroundEventType = RealtimeEventType | NonRealtimeEventType

export interface PlaygroundEvent {
    /** Event type identifier */
    type: PlaygroundEventType
    /** Client-side receive timestamp (ms since epoch) */
    timestamp: number
    /** Server-side timestamp if provided */
    serverTimestamp?: number
    /** Item ID within the conversation */
    item_id?: string
    /** Response ID for response-related events */
    response_id?: string
    /** Streaming text delta */
    delta?: string
    /** Full transcript text */
    transcript?: string
    /** Item payload (for conversation.item.created, response.output_item.added) */
    item?: PlaygroundEventItem
    /** Error details */
    error?: {
        message: string
        code?: string
        type?: string
    }
    /** Usage stats (from response.done) */
    usage?: {
        total_tokens?: number
        input_tokens?: number
        output_tokens?: number
    }
    /** Function call name (from response.function_call_arguments.done) */
    name?: string
    /** Call ID for function calls */
    call_id?: string
    /** Raw event payload for debug panel JSON view */
    _raw: Record<string, unknown>
}

export interface PlaygroundEventItem {
    id: string
    type?: string
    role?: string
    status?: string
    name?: string
    call_id?: string
    content?: Array<{
        type?: string
        text?: string
        transcript?: string
        audio?: string
    }>
}

/** Category for event filtering in debug panel */
export type EventCategory = 'audio' | 'transcript' | 'function' | 'response' | 'session' | 'error' | 'vad'

/** Map event type to category for filtering */
export function getEventCategory(type: PlaygroundEventType): EventCategory {
    if (type.startsWith('response.audio') || type === 'response.audio.delta' || type === 'response.audio.done') {
        return 'audio'
    }
    if (type.includes('transcript') || type.includes('text')) {
        return 'transcript'
    }
    if (type.includes('function_call')) {
        return 'function'
    }
    if (type.startsWith('response.')) {
        return 'response'
    }
    if (type.startsWith('session.')) {
        return 'session'
    }
    if (type.startsWith('input_audio_buffer.speech')) {
        return 'vad'
    }
    if (type === 'error') {
        return 'error'
    }
    // Non-realtime pipeline
    if (type.startsWith('stt.') || type.startsWith('llm.') || type.startsWith('tts.')) {
        return 'response'
    }
    return 'session'
}
