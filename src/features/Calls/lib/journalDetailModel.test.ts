import { journalMetrics, journalTurns, metricPercent } from './journalDetailModel'
import type { Report } from '@/entities/Report'
const report = (metrics: any): Report => ({ id: 'one', channelId: 'one', userId: '99', callerId: '', createdAt: '', analytics: { channelId: 'one', metrics } })
it('preserves custom scales and real reasoning without exposing internal model metadata as metrics', () => {
    const items = journalMetrics(report({ greeting_quality: 90, custom_metrics: { check: true, stars: 4, missing: null, _private: 99 }, _custom_meta: { stars: { name: 'Stars', type: 'number', min: 1, max: 5, unit: 'stars', polarity: 'positive' } }, _assessments: { stars: { rationale: 'Reason', quote: 'Quote' } }, _model: { name: 'private' } }))
    expect(items.map(item => item.id)).toEqual(['greeting_quality', 'check', 'stars'])
    expect(metricPercent(items[2])).toBe(75)
    expect(items[2]).toEqual(expect.objectContaining({ value: 4, unit: 'stars', rationale: 'Reason', quote: 'Quote' }))
    expect(metricPercent(items[1])).toBeNull()
})
it('preserves structured timestamps and plaintext safely, including malformed JSON', () => {
    const value = report({})
    value.transcription = JSON.stringify([{ speaker: 'operator', text: '<script>literal</script>', start: 11 }, { speaker: 'customer', text: 'Reply', start: -1 }])
    expect(journalTurns(value)[0]).toEqual({ id: '0', role: 'operator', text: '<script>literal</script>', start: 11 })
    expect(journalTurns(value)[1].start).toBeUndefined()
    value.transcription = '[invalid'
    expect(journalTurns(value)[0].text).toBe('[invalid')
    value.transcription = undefined
    expect(journalTurns(value, [{ channelId: 'one', role: 'User', text: 'Hello', timestamp: '2026-10-25T00:00:00Z' }, { channelId: 'one', role: 'Assistant', text: 'Reply', timestamp: '2026-10-25T00:00:12Z' }])[1].start).toBe(12)
})
