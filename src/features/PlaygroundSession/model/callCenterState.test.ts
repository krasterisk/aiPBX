import {
    CONNECTING_TIMEOUT_MS,
    resolveCallCenterView,
    buildSessionSummary,
} from './callCenterState'

describe('callCenterState', () => {
    it('shows empty state when there are no assistants (D-40)', () => {
        expect(resolveCallCenterView({
            hasAssistants: false,
            hasSelectedAssistant: false,
            status: 'idle',
            hasCompletedSession: false,
            transcriptLength: 0,
        })).toBe('empty')
    })

    it('shows checklist when idle with assistant selected (D-13)', () => {
        expect(resolveCallCenterView({
            hasAssistants: true,
            hasSelectedAssistant: true,
            status: 'idle',
            hasCompletedSession: false,
            transcriptLength: 0,
        })).toBe('checklist')
    })

    it('shows connecting while status is connecting (D-41)', () => {
        expect(resolveCallCenterView({
            hasAssistants: true,
            hasSelectedAssistant: true,
            status: 'connecting',
            hasCompletedSession: false,
            transcriptLength: 0,
        })).toBe('connecting')
    })

    it('uses 18s connecting timeout (D-41 / UI-SPEC)', () => {
        expect(CONNECTING_TIMEOUT_MS).toBe(18_000)
    })

    it('shows live transcript when connected (D-15)', () => {
        expect(resolveCallCenterView({
            hasAssistants: true,
            hasSelectedAssistant: true,
            status: 'connected',
            hasCompletedSession: false,
            transcriptLength: 2,
        })).toBe('connected')
    })

    it('shows post-call summary after hangup when history exists (D-16)', () => {
        expect(resolveCallCenterView({
            hasAssistants: true,
            hasSelectedAssistant: true,
            status: 'idle',
            hasCompletedSession: true,
            transcriptLength: 3,
        })).toBe('postCall')
    })

    it('returns connection error to idle checklist chrome (D-39)', () => {
        expect(resolveCallCenterView({
            hasAssistants: true,
            hasSelectedAssistant: true,
            status: 'error',
            hasCompletedSession: false,
            transcriptLength: 0,
        })).toBe('checklist')
    })

    it('builds summary with duration, errorCount, functionCallCount (D-16)', () => {
        expect(buildSessionSummary({
            durationMs: 65_000,
            errorCount: 2,
            functionCallCount: 4,
        })).toEqual({
            durationMs: 65_000,
            errorCount: 2,
            functionCallCount: 4,
        })
    })
})
