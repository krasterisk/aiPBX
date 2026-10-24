import { customDateRange, datePreset, localDateInput, shiftDateRange } from './datePresets'

describe('preview date presets', () => {
    const now = new Date(2026, 9, 24, 12, 30)
    it.each([
        ['today', 24],
        ['yesterday', 23],
        ['week', 19],
        ['last30', 25],
        ['month', 1]
    ] as const)('%s selects whole local days', (name, startDay) => {
        const range = datePreset(name, now)
        const start = new Date(range.startDate)
        const end = new Date(range.endDate)
        expect(start.getDate()).toBe(startDay)
        expect([start.getHours(), start.getMinutes()]).toEqual([0, 0])
        expect([end.getHours(), end.getMinutes(), end.getSeconds(), end.getMilliseconds()]).toEqual([23, 59, 59, 999])
        expect(end.getDate()).toBe(name === 'month' ? 31 : name === 'week' ? 25 : name === 'yesterday' ? 23 : 24)
    })
    it('handles a year boundary and includes exactly seven calendar dates', () => {
        const range = datePreset('week', new Date(2027, 0, 3))
        expect(localDateInput(range.startDate)).toBe('2026-12-28')
        expect(localDateInput(range.endDate)).toBe('2027-01-03')
    })
    it('rejects reversed or empty custom ranges and includes the last day', () => {
        expect(customDateRange('2026-10-24', '2026-10-23')).toBeNull()
        expect(customDateRange('', '')).toBeNull()
        const range = customDateRange('2026-10-23', '2026-10-24')!
        expect(new Date(range.endDate).getDate()).toBe(24)
        expect(new Date(range.endDate).getHours()).toBe(23)
    })
})

it('shifts a day, a week, and unequal calendar months in both directions', () => {
    for (const preset of ['today', 'week', 'month'] as const) {
        const original = datePreset(preset, new Date(2026, 0, 31))
        expect(shiftDateRange(shiftDateRange(original, 1), -1)).toEqual(original)
    }
    const feb = shiftDateRange(datePreset('month', new Date(2026, 0, 31)), 1)
    expect(localDateInput(feb.startDate)).toBe('2026-02-01')
    expect(localDateInput(feb.endDate)).toBe('2026-02-28')
    const week = shiftDateRange(datePreset('week', new Date(2026, 9, 24)), -1)
    expect(localDateInput(week.startDate)).toBe('2026-10-12')
    expect(localDateInput(week.endDate)).toBe('2026-10-18')
})
