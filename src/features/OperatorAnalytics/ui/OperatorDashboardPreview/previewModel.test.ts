import { trendSeries, isSingleDay, dayQuery, hourQuery, operatorQuery, previewCsv, previewDuration } from './previewModel'

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
