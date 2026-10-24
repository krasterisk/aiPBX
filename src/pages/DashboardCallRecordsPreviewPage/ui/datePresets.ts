export type DatePreset = 'today' | 'yesterday' | 'week' | 'last30' | 'month'
export interface DateRange {
    startDate: string
    endDate: string
}

export function datePreset(preset: DatePreset, now = new Date()): DateRange {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    if (preset === 'yesterday') {
        start.setDate(start.getDate() - 1)
        end.setDate(end.getDate() - 1)
    }
    if (preset === 'last30') start.setDate(start.getDate() - 29)
    if (preset === 'week') {
        start.setDate(start.getDate() - (start.getDay() + 6) % 7)
        end.setFullYear(start.getFullYear(), start.getMonth(), start.getDate() + 6)
    }
    if (preset === 'month') {
        start.setDate(1)
        end.setMonth(end.getMonth() + 1, 0)
    }
    return { startDate: start.toISOString(), endDate: end.toISOString() }
}

export function customDateRange(from: string, to: string): DateRange | null {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) return null
    const start = new Date(from + 'T00:00:00')
    const end = new Date(to + 'T23:59:59.999')
    if (
        !Number.isFinite(start.getTime()) ||
        !Number.isFinite(end.getTime()) ||
        start > end ||
        localDateInput(start.toISOString()) !== from ||
        localDateInput(end.toISOString()) !== to
    ) {
        return null
    }
    return { startDate: start.toISOString(), endDate: end.toISOString() }
}

export function localDateInput(value: string): string {
    const date = new Date(value)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/** Shift by calendar days, preserving DST; whole months/years stay whole. */
export function shiftDateRange(value: DateRange, direction: -1 | 1): DateRange {
    const start = new Date(value.startDate)
        const end = new Date(value.endDate)
    if (start.getDate() === 1 && end.getDate() === new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate()) {
        const months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1
        const from = new Date(start.getFullYear(), start.getMonth() + direction * months, 1)
        const to = new Date(from.getFullYear(), from.getMonth() + months, 0, 23, 59, 59, 999)
        return { startDate: from.toISOString(), endDate: to.toISOString() }
    }
    const days =
        Math.round(
            (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) -
                Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) /
                86400000
        ) + 1
    start.setDate(start.getDate() + direction * days)
    end.setDate(end.getDate() + direction * days)
    return { startDate: start.toISOString(), endDate: end.toISOString() }
}
