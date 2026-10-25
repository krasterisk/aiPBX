import { journalCustomRange, journalDateInput, journalPeriod, journalProject, journalQuery, shiftJournalRange, type JournalFilters } from './journalModel'

describe('journal query and calendar contract', () => {
    it('unions stable selections without dropping account, date, topic, project or CSAT on export pages', () => {
        const a = JSON.stringify({ userId: '99', operatorId: '218' })
        const b = JSON.stringify({ userId: '99', assistantId: '7' })
        const filters: JournalFilters = { ...journalPeriod('day', 0, new Date(2026, 9, 25)), userId: '99', search: ' word ', sources: ['external-api', 'call', 'call'], callTypes: ['incoming', 'outgoing'], people: [a, b, a], csat: ['5', 'none'], tagId: 'service', projectId: '5', sortField: 'duration', sortOrder: 'DESC' }
        const list = journalQuery(filters, 2, 20)
        const exported = journalQuery(filters, 3, 1000)
        expect({ ...exported, page: list.page, limit: list.limit }).toEqual(list)
        expect(JSON.parse(list.people!)).toEqual(expect.arrayContaining([{ userId: '99', operatorId: '218' }, { userId: '99', assistantId: '7' }]))
        expect(JSON.parse(list.people!)).toHaveLength(2)
        expect(JSON.parse(list.sources!)).toEqual(['call', 'external-api'])
        expect(list).toEqual(expect.objectContaining({ userId: '99', search: 'word', tagId: 'service', projectId: '5', csat: '5,none' }))
    })
    it('uses calendar Monday–Sunday and local midnight bounds', () => {
        const range = journalPeriod('week', 0, new Date(2026, 9, 25, 14))
        expect(journalDateInput(range.startDate)).toBe('2026-10-19')
        expect(journalDateInput(range.endDate)).toBe('2026-10-25')
        expect(new Date(range.startDate).getHours()).toBe(0)
        expect(new Date(range.endDate).getMilliseconds()).toBe(999)
    })
    it.each(['day', 'week', 'month', 'year'] as const)('shifts %s back and forward without drifting calendar bounds', period => {
        const range = journalPeriod(period, 0, new Date(2026, 9, 25))
        expect(shiftJournalRange(shiftJournalRange(range, -1), 1)).toEqual(range)
    })
    it('rejects impossible and backwards custom dates', () => {
        expect(journalCustomRange('2026-02-30', '2026-03-01')).toBeNull()
        expect(journalCustomRange('2026-10-26', '2026-10-25')).toBeNull()
        expect(journalCustomRange('', '2026-10-25')).toBeNull()
    })
    it('does not use another cabinet project configuration when IDs collide', () => {
        const row: any = { projectId: '5', userId: '99' }
        const wrong: any = { id: '5', userId: '100' }
        const right: any = { id: '5', userId: '99' }
        expect(journalProject(row, [wrong, right])).toBe(right)
        expect(journalProject(row, [wrong])).toBeUndefined()
    })
})
