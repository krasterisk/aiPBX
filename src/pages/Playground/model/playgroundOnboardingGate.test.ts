import {
    MIN_CONNECTED_MS,
    shouldRecordOnboardingCallSuccess,
} from './playgroundOnboardingGate'

describe('playgroundOnboardingGate (PG-UX-08)', () => {
    it('keeps the ≥10s connected gate', () => {
        expect(MIN_CONNECTED_MS).toBe(10_000)
    })

    it('records success when onboarding and connected ≥10s', () => {
        expect(shouldRecordOnboardingCallSuccess(
            { wasConnected: true, connectedDurationMs: 10_000 },
            true
        )).toBe(true)
        expect(shouldRecordOnboardingCallSuccess(
            { wasConnected: true, connectedDurationMs: 12_500 },
            true
        )).toBe(true)
    })

    it('does not record when under 10s or not onboarding', () => {
        expect(shouldRecordOnboardingCallSuccess(
            { wasConnected: true, connectedDurationMs: 9_999 },
            true
        )).toBe(false)
        expect(shouldRecordOnboardingCallSuccess(
            { wasConnected: false, connectedDurationMs: 15_000 },
            true
        )).toBe(false)
        expect(shouldRecordOnboardingCallSuccess(
            { wasConnected: true, connectedDurationMs: 15_000 },
            false
        )).toBe(false)
    })
})
