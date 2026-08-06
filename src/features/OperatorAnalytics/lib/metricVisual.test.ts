import {
    csatVariant,
    formatEvidenceMetricAverage,
    formatEvidenceMetricValue,
    getDefaultMetricDescriptionKey,
    getMetricLabelKey,
    scoreVariant,
    ALL_DEFAULT_METRICS,
} from './metricVisual'
const t = (key: string) => key
describe('metricVisual summary formatting', () => {
    it('resolves localized label keys for summary metrics', () => {
        expect(getMetricLabelKey('csat')).toBe('Удовлетворённость клиента (CSAT)')
        expect(getMetricLabelKey('customer_sentiment')).toBe('Эмоциональный настрой клиента')
        expect(getMetricLabelKey('success')).toBe('Итог обращения')
        expect(getMetricLabelKey('greeting_quality')).toBe('Качество приветствия')
    })
    it('exposes description keys for all nine default metrics', () => {
        expect(ALL_DEFAULT_METRICS).toHaveLength(9)
        for (const metric of ALL_DEFAULT_METRICS) {
            expect(metric.descriptionKey).toMatch(/^METRIC_DESC_/)
            expect(getDefaultMetricDescriptionKey(metric.key)).toBe(metric.descriptionKey)
        }
    })
    it('formats CSAT on a 1–5 scale instead of treating it as 0–100', () => {
        expect(formatEvidenceMetricAverage('csat', 5, t)).toEqual({
            text: '5.0 / 5',
            variant: 'success',
            labelKey: 'Средний CSAT',
        })
        expect(formatEvidenceMetricAverage('csat', 3, t)).toEqual({
            text: '3.0 / 5',
            variant: 'warning',
            labelKey: 'Средний CSAT',
        })
        expect(csatVariant(2)).toBe('error')
        expect(scoreVariant(5)).toBe('error')
    })
    it('formats success as a percentage', () => {
        expect(formatEvidenceMetricAverage('success', 80, t)).toEqual({
            text: '80%',
            variant: 'success',
            labelKey: 'Доля успешных обращений',
        })
    })
    it('formats sentiment averages as localized tone labels', () => {
        expect(formatEvidenceMetricAverage('customer_sentiment', 100, t)).toEqual({
            text: 'Positive',
            variant: 'success',
            labelKey: 'Преобладающий настрой',
        })
        expect(formatEvidenceMetricAverage('customer_sentiment', 50, t)).toEqual({
            text: 'Neutral',
            variant: 'warning',
            labelKey: 'Преобладающий настрой',
        })
        expect(formatEvidenceMetricAverage('customer_sentiment', 0, t)).toEqual({
            text: 'Negative',
            variant: 'error',
            labelKey: 'Преобладающий настрой',
        })
    })
    it('formats boolean custom-metric rates as percent of yes', () => {
        expect(formatEvidenceMetricAverage('service_booking', 50, t, {
            evidenceValues: [true, false],
        })).toEqual({
            text: '50%',
            variant: 'warning',
            labelKey: 'Доля «да»',
        })
    })
    it('formats boolean evidence values as Да/Нет', () => {
        expect(formatEvidenceMetricValue(true, t)).toEqual({ text: 'Да', variant: 'success' })
        expect(formatEvidenceMetricValue(false, t)).toEqual({ text: 'Нет', variant: 'error' })
    })
    it('renders an em dash when average is missing', () => {
        expect(formatEvidenceMetricAverage('csat', null, t)).toEqual({
            text: '-',
            variant: 'primary',
            labelKey: 'Средний балл метрики',
        })
    })
})
