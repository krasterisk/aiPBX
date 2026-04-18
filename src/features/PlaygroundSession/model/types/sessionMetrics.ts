/**
 * Real-time session metrics for the debug panel.
 */

export interface SessionMetrics {
    /** When session started (ms since epoch) */
    sessionStartTime: number
    /** Time to first AI response in ms (null until first response arrives) */
    firstResponseLatencyMs: number | null
    /** Average response latency across all turns */
    avgResponseLatencyMs: number
    /** Total input tokens consumed */
    totalTokensIn: number
    /** Total output tokens consumed */
    totalTokensOut: number
    /** Number of completed user→assistant turns */
    turnCount: number
    /** Number of AI interruptions */
    interruptCount: number
    /** Number of function calls executed */
    functionCallCount: number
    /** Individual response latency values for sparkline chart */
    responseTimes: number[]
    /** VAD state change events for timeline overlay */
    vadEvents: VadEvent[]
}

export interface VadEvent {
    type: 'speech_started' | 'speech_stopped'
    timestamp: number
}

/** Current VAD state derived from events */
export type VadState = 'idle' | 'listening' | 'speaking'

/**
 * Creates initial empty metrics.
 */
export function createInitialMetrics(): SessionMetrics {
    return {
        sessionStartTime: Date.now(),
        firstResponseLatencyMs: null,
        avgResponseLatencyMs: 0,
        totalTokensIn: 0,
        totalTokensOut: 0,
        turnCount: 0,
        interruptCount: 0,
        functionCallCount: 0,
        responseTimes: [],
        vadEvents: [],
    }
}
