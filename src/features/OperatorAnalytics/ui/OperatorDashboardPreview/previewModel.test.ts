import { trendSeries, isSingleDay, dayQuery, hourQuery, operatorQuery, previewCsv, previewDuration, customMetricDisplay, scoreTone, sortedOperators } from './previewModel'

describe('preview query boundaries', () => {
    it('preserves an operator account and stable identity, avoiding fuzzy names', () => {
        expect(operatorQuery({ operatorId: '218', operatorAccountId: '99', operatorName: 'Same Name' })).toEqual({
            userId: '99',
            operatorId: '218'
        })
        expect(operatorQuery({ operatorName: 'Same Name' })).toEqual({ operatorNameExact: 'Same Name' })
        expect(operatorQuery({ operatorName: 'Unknown Operator' })).toEqual({ withoutOperator: true })
    })
    it('intersects UTC daily buckets with the original tenant/project/date range', () => {
        const filters = { projectId: '5', userId: '99', startDate: '2026-10-23T17:00:00.000Z', endDate: '2026-10-24T16:59:59.999Z' }
        expect(dayQuery('2026-10-24', filters)).toEqual({ ...filters, startDate: '2026-10-24T00:00:00.000Z' })
        expect(dayQuery('2026-10-22', filters)).toBeNull()
        expect(dayQuery('invalid', filters)).toBeNull()
    })
    it('uses a full UTC month without widening an explicit selection', () => {
        expect(dayQuery('2026-02', {})).toEqual({ startDate: '2026-02-01T00:00:00.000Z', endDate: '2026-02-28T23:59:59.999Z' })
        expect(dayQuery('2026-02', { startDate: '2026-02-10T00:00:00Z' })?.startDate).toBe('2026-02-10T00:00:00.000Z')
    })
    it('exports quoted CSV without executable spreadsheet formulas', () => {
        expect(previewCsv([['=SUM(1,2)', '+79000000001', 'a"b']])).toBe('\ufeff"\'=SUM(1,2)";"\'+79000000001";"a""b"')
        expect(previewDuration(72)).toBe('1:12')
        expect(previewDuration(undefined)).toBe('—')
        expect(previewDuration(0)).toBe('0:00')
    })
})

it('normalizes every custom metric to the same percentage scale without fractions in labels', () => {
    expect(customMetricDisplay({ id: 'a', name: 'A', description: 'Synthetic criterion', type: 'number', min: 1, max: 5 }, { type: 'number', value: 3.2 }).text).toBe('55%')
    expect(customMetricDisplay({ id: 'a', name: 'A', description: 'Synthetic criterion', type: 'boolean' }, { type: 'boolean', value: 79.6 }).text).toBe('80%')
    expect(customMetricDisplay({ id: 'a', name: 'A', description: 'Synthetic criterion', type: 'enum' }, { type: 'enum', distribution: { Yes: 3, No: 1 } })).toEqual({ text: 'Yes · 75%', percent: 75, distribution: 'Yes: 75% · No: 25%' })
    expect(customMetricDisplay({ id: 'a', name: 'A', description: 'Synthetic criterion', type: 'number' }, undefined).text).toBe('—')
})

it('keeps unscored operators last and assigns stable score colors at threshold boundaries', () => {
    const rows: any[] = [{ operatorName: 'Unscored', averageScore: 100, scoredCalls: 0 }, { operatorName: 'Low', averageScore: 42 }, { operatorName: 'High', averageScore: 86 }]
    expect(sortedOperators(rows, 'averageScore', true).map(o => o.operatorName)).toEqual(['High', 'Low', 'Unscored'])
    expect(sortedOperators(rows, 'averageScore', false).map(o => o.operatorName)).toEqual(['Low', 'High', 'Unscored'])
    expect([undefined, 49, 50, 79, 80].map(scoreTone)).toEqual(['none', 'low', 'medium', 'medium', 'high'])
})

it('preserves all three call types when rolling daily buckets into a year', () => {
    const time = { monthly: [], daily: [{ label: '2026-10-24', callsCount: 6, avgScore: 60, avgDuration: 30, byCallType: { incoming: 3, outgoing: 2, internal: 1 } }, { label: '2026-11-24', callsCount: 4, avgScore: 70, avgDuration: 40, byCallType: { incoming: 2, outgoing: 1, internal: 1 } }] }
    expect(trendSeries(time, { startDate: '2025-01-01', endDate: '2026-12-31' }).points[0].byCallType).toEqual({ incoming: 5, outgoing: 3, internal: 2 })
})

it('intersects a UTC hour with the original partial-hour selection', () => {
    const filters = { userId: '99', projectId: '5', startDate: '2026-10-24T06:30:00Z', endDate: '2026-10-24T07:45:00Z' }
    expect(hourQuery('2026-10-24T06:00:00Z', filters)).toEqual({
        ...filters,
        startDate: '2026-10-24T06:30:00.000Z',
        endDate: '2026-10-24T06:59:59.999Z'
    })
    expect(hourQuery('2026-10-24T08:00:00Z', filters)).toBeNull()
})

it('automatically scales selected ranges to days, months, and years', () => {
    const time = {
        daily: [{ label: '2026-10-24', callsCount: 2, avgScore: 60, avgDuration: 30 }],
        monthly: [
            { label: '2026-10', callsCount: 2, avgScore: 60, avgDuration: 30 },
            { label: '2026-11', callsCount: 6, avgScore: 80, avgDuration: 50 }
        ]
    }
    expect(isSingleDay({ startDate: '2026-10-24', endDate: '2026-10-24' })).toBe(true)
    expect(isSingleDay({ startDate: '2026-10-24', endDate: '2026-10-25' })).toBe(false)
    expect(trendSeries(time, { startDate: '2026-10-01', endDate: '2026-10-31' }).unit).toBe('day')
    expect(trendSeries(time, { startDate: '2026-10-01', endDate: '2026-11-30' }).unit).toBe('month')
    const years = trendSeries({ ...time, daily: [] }, { startDate: '2025-01-01', endDate: '2026-12-31' })
    expect(years.unit).toBe('year')
    expect(years.points).toEqual([{ label: '2026', callsCount: 8, avgScore: 75, avgDuration: 45 }])
    expect(dayQuery('2026', {})).toEqual({ startDate: '2026-01-01T00:00:00.000Z', endDate: '2026-12-31T23:59:59.999Z' })
})
