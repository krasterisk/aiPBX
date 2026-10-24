import type { AgentScorecard, OperatorProject, OperatorDashboardResponse } from '@/entities/Report'

export type PreviewCallType = 'incoming' | 'outgoing' | 'internal'
export interface PreviewFilters {
    operatorFilters?: string
    callType?: PreviewCallType
    startDate?: string
    endDate?: string
    projectId?: string
    userId?: string
}

export interface PreviewCallsQuery extends PreviewFilters {
    operatorId?: string
    operatorNameExact?: string
    withoutOperator?: boolean
    tagId?: string
    withoutTopic?: boolean
    sentiment?: 'positive' | 'neutral' | 'negative'
    success?: boolean
}

export function operatorQuery(
    operator: Pick<AgentScorecard, 'operatorId' | 'operatorAccountId' | 'operatorName'>
): Pick<PreviewCallsQuery, 'userId' | 'operatorId' | 'operatorNameExact' | 'withoutOperator'> {
    return {
        ...(operator.operatorAccountId ? { userId: operator.operatorAccountId } : {}),
        ...(operator.operatorId
            ? { operatorId: operator.operatorId }
            : operator.operatorName && operator.operatorName !== 'Unknown Operator'
            ? { operatorNameExact: operator.operatorName }
            : { withoutOperator: true })
    }
}

/** Backend daily labels are UTC buckets. Intersect a drilldown with the selected range. */
export function dayQuery(label: string, filters: PreviewFilters): PreviewFilters | null {
    if (!/^\d{4}(-\d{2}){0,2}$/.test(label)) return null
    const start = Date.parse((label.length === 4 ? label + '-01-01' : label.length === 7 ? label + '-01' : label) + 'T00:00:00.000Z')
    const first = new Date(start)
    const end =
        label.length === 4
            ? Date.UTC(first.getUTCFullYear() + 1, 0, 1) - 1
            : label.length === 7
            ? Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 1) - 1
            : start + 86400000 - 1
    if (!Number.isFinite(start) || !Number.isFinite(end)) return null
    const selectedStart = filters.startDate ? Date.parse(filters.startDate) : start
    const selectedEnd = filters.endDate ? Date.parse(filters.endDate) : end
    if (!Number.isFinite(selectedStart) || !Number.isFinite(selectedEnd)) return null
    const from = Math.max(start, selectedStart)
    const to = Math.min(end, selectedEnd)
    return from <= to ? { ...filters, startDate: new Date(from).toISOString(), endDate: new Date(to).toISOString() } : null
}

export function previewDuration(seconds?: number): string {
    if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return '—'
    const n = Math.floor(seconds)
    return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`
}

/** Prevent spreadsheet formulas in user-controlled names and phone numbers. */
export function previewCsv(rows: Array<Array<string | number>>): string {
    return (
        '\ufeff' +
        rows
            .map(row =>
                row
                    .map(value => {
                        const text = String(value)
                        return '"' + (/^[\s]*[=+@-]/.test(text) ? "'" : '') + text.replace(/"/g, '""') + '"'
                    })
                    .join(';')
            )
            .join('\r\n')
    )
}

/** Exact hour drilldowns share the UTC bucket returned by the server. */
export function hourQuery(label: string, filters: PreviewFilters): PreviewFilters | null {
    const start = Date.parse(label)
    if (!/^\d{4}-\d{2}-\d{2}T/.test(label) || !Number.isFinite(start)) return null
    const from = Math.max(start, filters.startDate ? Date.parse(filters.startDate) : start)
    const end = start + 3600000 - 1
    const to = Math.min(end, filters.endDate ? Date.parse(filters.endDate) : end)
    return Number.isFinite(from) && Number.isFinite(to) && from <= to
        ? { ...filters, startDate: new Date(from).toISOString(), endDate: new Date(to).toISOString() }
        : null
}

/** Compare the selected calendar days in the viewer's timezone. */
export function isSingleDay(filters: PreviewFilters): boolean {
    if (!filters.startDate || !filters.endDate) return false
    const key = (value: string) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
        const date = new Date(value)
        return Number.isFinite(date.getTime()) ? [date.getFullYear(), date.getMonth(), date.getDate()].join('-') : null
    }
    const from = key(filters.startDate)
    return from !== null && from === key(filters.endDate)
}

export interface TrendPoint {
    byCallType?: Record<PreviewCallType, number>
    label: string
    callsCount: number
    avgScore: number
    avgDuration: number
}
export function trendSeries(timeSeries: { daily: TrendPoint[], monthly: TrendPoint[], hourly?: TrendPoint[] }, filters: PreviewFilters) {
    const labels = timeSeries.daily.map(point => Date.parse(point.label)).filter(Number.isFinite)
    const from = filters.startDate ? Date.parse(filters.startDate) : Math.min(...labels)
    const to = filters.endDate ? Date.parse(filters.endDate) : Math.max(...labels)
    const days = (to - from) / 86400000
    if (isSingleDay(filters) && timeSeries.hourly?.length) return { unit: 'hour' as const, points: timeSeries.hourly }
    if (days <= 31) return { unit: 'day' as const, points: timeSeries.daily }

    const years = new Map<string, TrendPoint>()
    const monthly = days <= 366
    for (const point of timeSeries.daily.length ? timeSeries.daily : timeSeries.monthly) {
        const year = point.label.slice(0, monthly ? 7 : 4)
        const bucket = years.get(year) ?? { label: year, callsCount: 0, avgScore: 0, avgDuration: 0 }
        if (point.byCallType) {
            bucket.byCallType ??= { incoming: 0, outgoing: 0, internal: 0 }
            for (const type of ['incoming', 'outgoing', 'internal'] as const) bucket.byCallType[type] += point.byCallType[type]
        }
        bucket.callsCount += point.callsCount
        bucket.avgScore += point.avgScore * point.callsCount
        bucket.avgDuration += point.avgDuration * point.callsCount
        years.set(year, bucket)
    }
    return {
        unit: monthly ? ('month' as const) : ('year' as const),
        points: Array.from(years.values()).map(point => ({
            ...point,
            avgScore: point.callsCount ? point.avgScore / point.callsCount : 0,
            avgDuration: point.callsCount ? point.avgDuration / point.callsCount : 0
        }))
    }
}

export const operatorIdentity = (o: Pick<AgentScorecard, 'operatorId' | 'operatorAccountId' | 'operatorName'>) =>
    JSON.stringify([o.operatorAccountId, o.operatorId, o.operatorName])
export const operatorSelection = (operators: AgentScorecard[]) =>
    operators.length ? { operatorFilters: JSON.stringify(operators.map(operatorQuery)) } : {}
export const scoreTone = (score?: number | null) =>
    score == null || !Number.isFinite(score) ? 'none' : score < 50 ? 'low' : score < 80 ? 'medium' : 'high'
export type OperatorSortKey = 'operatorName' | 'callsCount' | 'averageScore' | 'successRate' | 'avgCsat' | 'negativeRate'
export function sortedOperators(rows: AgentScorecard[], key: OperatorSortKey, descending: boolean): AgentScorecard[] {
    return rows.slice().sort((a, b) => {
        const first = key === 'averageScore' && a.scoredCalls === 0 ? null : a[key]
            const second = key === 'averageScore' && b.scoredCalls === 0 ? null : b[key]
        if (first == null || second == null) return first == null ? (second == null ? 0 : 1) : -1
        const compare = typeof first === 'string' ? first.localeCompare(String(second)) : Number(first) - Number(second)
        return (descending ? -compare : compare) || a.operatorName.localeCompare(b.operatorName)
    })
}
export function customMetricDisplay(
    metric: NonNullable<OperatorProject['customMetricsSchema']>[number],
    aggregate: NonNullable<OperatorDashboardResponse['customMetricsAggregated']>[string] | undefined
) {
    if (aggregate?.value != null && Number.isFinite(aggregate.value)) {
        const min = metric.type === 'number' ? metric.min ?? 0 : 0
            const max = metric.type === 'number' ? metric.max ?? 100 : 100
        const percent = max > min ? Math.max(0, Math.min(100, ((aggregate.value - min) * 100) / (max - min))) : null
        return { text: percent != null ? Math.round(percent) + '%' : '—', percent, distribution: null }
    }
    const entries = Object.entries(aggregate?.distribution ?? {})
        const total = entries.reduce((sum, [, count]) => sum + count, 0)
    const leading = entries.sort((a, b) => b[1] - a[1])[0]
    return {
        text: leading && total ? leading[0] + ' · ' + Math.round((leading[1] * 100) / total) + '%' : '—',
        percent: leading && total ? (leading[1] * 100) / total : null,
        distribution: entries.map(([label, count]) => label + ': ' + (total ? Math.round((count * 100) / total) : 0) + '%').join(' · ')
    }
}
