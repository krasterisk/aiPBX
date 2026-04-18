/**
 * Typed transcript item for the conversation panel.
 * Each item represents one "turn" or action in the dialogue.
 */

export type TranscriptRole = 'user' | 'assistant' | 'function' | 'system'

export interface TranscriptItem {
    /** Unique item ID (from OpenAI or generated) */
    id: string
    /** Speaker role */
    role: TranscriptRole
    /** Displayed text content */
    text: string
    /** When this item was first created (ms since epoch) */
    timestamp: number
    /** Whether this item is still receiving streaming deltas */
    isStreaming: boolean

    // --- Function call specifics ---
    /** Function name (for role === 'function') */
    functionName?: string
    /** Function arguments JSON string */
    functionArgs?: string
    /** Function result (if available) */
    functionResult?: string
    /** Call ID for function calls */
    callId?: string

    // --- Audio metadata ---
    /** Duration of audio playback for this item (ms) */
    audioDurationMs?: number
}

/**
 * Creates a new empty transcript item with defaults.
 */
export function createTranscriptItem(
    id: string,
    role: TranscriptRole,
    text = '',
    timestamp?: number
): TranscriptItem {
    return {
        id,
        role,
        text,
        timestamp: timestamp ?? Date.now(),
        isStreaming: role === 'assistant',
    }
}
