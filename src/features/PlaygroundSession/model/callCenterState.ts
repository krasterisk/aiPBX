import { PlaygroundSessionStatus } from './playgroundMode'

/** UI-SPEC connecting timeout (D-41 discretion within 15–20s). */
export const CONNECTING_TIMEOUT_MS = 18_000

export type CallCenterView =
    | 'empty'
    | 'checklist'
    | 'connecting'
    | 'connected'
    | 'postCall'

export interface CallCenterViewInput {
    hasAssistants: boolean
    hasSelectedAssistant: boolean
    status: PlaygroundSessionStatus
    /** True after at least one connected→idle hangup this page visit. */
    hasCompletedSession: boolean
    transcriptLength: number
}

/**
 * Map session + selection state to Call center UI (UI-SPEC Call center states).
 * Connection errors return to idle checklist chrome (D-39) — toast/header handle the error.
 */
export function resolveCallCenterView (input: CallCenterViewInput): CallCenterView {
    const {
        hasAssistants,
        hasSelectedAssistant,
        status,
        hasCompletedSession,
        transcriptLength,
    } = input

    if (!hasAssistants) {
        return 'empty'
    }

    if (status === 'connecting') {
        return 'connecting'
    }

    if (status === 'connected') {
        return 'connected'
    }

    // error → idle checklist (D-39)
    if (hasSelectedAssistant && hasCompletedSession && transcriptLength > 0 && status === 'idle') {
        return 'postCall'
    }

    if (hasSelectedAssistant) {
        return 'checklist'
    }

    return 'checklist'
}

export interface SessionSummary {
    durationMs: number
    errorCount: number
    functionCallCount: number
}

export function buildSessionSummary (input: SessionSummary): SessionSummary {
    return {
        durationMs: Math.max(0, input.durationMs),
        errorCount: Math.max(0, input.errorCount),
        functionCallCount: Math.max(0, input.functionCallCount),
    }
}

export function formatSummaryDuration (durationMs: number): string {
    const totalSeconds = Math.max(0, Math.floor(durationMs / 1000))
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
