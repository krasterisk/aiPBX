import { formatDuration } from '@/shared/lib/formatDuration'
import type { JournalQuery, OperatorProject, Report } from '@/entities/Report'

export type JournalPeriod = 'day' | 'week' | 'month' | 'year'
export interface JournalRange { startDate: string, endDate: string }
export interface JournalFilters extends JournalRange {
    search: string
    userId?: string
    sources: string[]
    callTypes: string[]
    people: string[]
    csat: string[]
    tagIds?: string[]
    tagId: string
    projectId: string
    sortField: string
    sortOrder: 'ASC' | 'DESC'
}

export function journalPeriod(period: JournalPeriod, offset = 0, now = new Date()): JournalRange {
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    let to: Date
    if (period === 'day') { from.setDate(from.getDate() + offset); to = new Date(from) } else if (period === 'week') { from.setDate(from.getDate() - (from.getDay() + 6) % 7 + offset * 7); to = new Date(from); to.setDate(to.getDate() + 6) } else if (period === 'month') { from.setDate(1); from.setMonth(from.getMonth() + offset); to = new Date(from.getFullYear(), from.getMonth() + 1, 0) } else { from.setMonth(0, 1); from.setFullYear(from.getFullYear() + offset); to = new Date(from.getFullYear(), 11, 31) }
    to.setHours(23, 59, 59, 999)
    return { startDate: from.toISOString(), endDate: to.toISOString() }
}

export function journalDateInput(iso: string): string {
    const d = new Date(iso)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function journalCustomRange(start: string, end: string): JournalRange | null {
    const from = new Date(start + 'T00:00:00')
    const to = new Date(end + 'T23:59:59.999')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end) ||
        !Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || from > to ||
        journalDateInput(from.toISOString()) !== start || journalDateInput(to.toISOString()) !== end) return null
    return { startDate: from.toISOString(), endDate: to.toISOString() }
}

export function journalQuery(filters: JournalFilters, page = 1, limit = 20): JournalQuery {
    const list = (items: string[]) => items.length ? JSON.stringify(Array.from(new Set(items)).sort()) : undefined
    return {
        page,
limit,
search: filters.search.trim(),
userId: filters.userId || undefined,
        startDate: filters.startDate,
endDate: filters.endDate,
        sources: list(filters.sources),
callTypes: list(filters.callTypes),
        people: filters.people.length ? JSON.stringify(Array.from(new Set(filters.people)).sort().map(v => JSON.parse(v))) : undefined,
        csat: filters.csat.length ? Array.from(new Set(filters.csat)).sort().join(',') : undefined,
        tagId: filters.tagIds?.length ? undefined : filters.tagId || undefined,
        tagIds: list(filters.tagIds ?? []),
projectId: filters.projectId || undefined,
sortField: filters.sortField,
sortOrder: filters.sortOrder
    }
}

export function journalProject(report: Report, projects: OperatorProject[]): OperatorProject | undefined {
    return projects.find(p => String(p.id) === String(report.projectId) && (!p.userId || String(p.userId) === String(report.userId)))
}

export const journalDuration = formatDuration

export const journalScoreTone = (value: number | null) => value == null ? 'none' : value < 50 ? 'low' : value < 80 ? 'medium' : 'high'

export function shiftJournalRange(range: JournalRange, direction: -1 | 1): JournalRange {
    const from = new Date(range.startDate)
    const to = new Date(range.endDate)
    if (from.getDate() === 1 && to.getDate() === new Date(to.getFullYear(), to.getMonth() + 1, 0).getDate()) {
        const months = (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth() + 1
        const next = new Date(from.getFullYear(), from.getMonth() + direction * months, 1)
        return { startDate: next.toISOString(), endDate: new Date(next.getFullYear(), next.getMonth() + months, 0, 23, 59, 59, 999).toISOString() }
    }
    const days = Math.round((Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) - Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())) / 86400000) + 1
    from.setDate(from.getDate() + direction * days)
    to.setDate(to.getDate() + direction * days)
    return { startDate: from.toISOString(), endDate: to.toISOString() }
}
