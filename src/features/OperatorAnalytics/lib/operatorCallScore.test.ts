import { operatorCallScore } from './operatorCallScore'

describe('operatorCallScore', () => {
    it('scores only the enabled project metrics', () => {
        expect(operatorCallScore({ greeting_quality: 90, closing_quality: 91, script_compliance: 0 },
            ['greeting_quality', 'closing_quality'], true)).toBe(91)
    })

    it('includes custom checklists and numbers while skipping null and non-score values', () => {
        expect(operatorCallScore({
            greeting_quality: 90,
            custom_metrics: { yes: true, no: false, score: 70, na: null, text: 'good', amount: 500 },
        }, ['greeting_quality'], true)).toBe(65)
    })

    it('keeps an enabled missing metric at zero and preserves an explicit zero', () => {
        expect(operatorCallScore({ greeting_quality: 90, closing_quality: 0 },
            ['greeting_quality', 'closing_quality', 'active_listening'])).toBe(30)
    })

    it('does not turn null into zero in the fallback for calls without project settings', () => {
        expect(operatorCallScore({ greeting_quality: 90, closing_quality: null })).toBe(90)
        expect(operatorCallScore(undefined)).toBeNull()
        expect(operatorCallScore({})).toBeNull()
    })
})
