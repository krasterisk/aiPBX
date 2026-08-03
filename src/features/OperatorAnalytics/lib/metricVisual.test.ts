import {
    csatVariant,
    formatEvidenceMetricAverage,
    getMetricLabelKey,
    scoreVariant,
} from './metricVisual'

const t = (key: string) => key

describe('metricVisual summary formatting', () => {
    it('resolves localized label keys for summary metrics', () => {
        expect(getMetricLabelKey('csat')).toBe('Удовлетворённость клиента (CSAT)')
        expect(getMetricLabelKey('customer_sentiment')).toBe('Эмоциональный настрой клиента')
        expect(getMetricLabelKey('success')).toBe('Итог обращения')
        expect(getMetricLabelKey('greeting_quality')).toBe('Качество приветствия')
    })

    it('formats CSAT on a 1–5 scale instead of treating it as 0–100', () => {
        expect(formatEvidenceMetricAverage('csat', 5, t)).toEqual({
            text: '5.0 / 5',
            variant: 'success',
        })
        expect(formatEvidenceMetricAverage('csat', 3, t)).toEqual({
            text: '3.0 / 5',
            variant: 'warning',
        })
        expect(csatVariant(2)).toBe('error')
        expect(scoreVariant(5)).toBe('error')
    })

    it('formats success as a percentage', () => {
        expect(formatEvidenceMetricAverage('success', 80, t)).toEqual({
            text: '80%',
            variant: 'success',
        })
    })

    it('formats sentiment averages as localized tone labels', () => {
        expect(formatEvidenceMetricAverage('customer_sentiment', 100, t)).toEqual({
            text: 'Positive',
            variant: 'success',
        })
        expect(formatEvidenceMetricAverage('customer_sentiment', 50, t)).toEqual({
            text: 'Neutral',
            variant: 'warning',
        })
        expect(formatEvidenceMetricAverage('customer_sentiment', 0, t)).toEqual({
            text: 'Negative',
            variant: 'error',
        })
    })

    it('renders an em dash when average is missing', () => {
        expect(formatEvidenceMetricAverage('csat', null, t)).toEqual({
            text: '—',
            variant: 'primary',
        })
    })
})
