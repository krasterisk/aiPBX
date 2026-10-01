import { formatDate } from '@/shared/lib/functions/formatDate'

type Translate = (key: string) => string

export interface DistributionExportCall {
    id: string
    createdAt: string
    assistantName?: string
    operatorName?: string
    callerId?: string
    clientPhone?: string
    duration?: number
    analytics?: {
        summary?: string
        sentiment?: string
        metrics?: Record<string, unknown>
    }
}

export type ExportCell = string | number

function cellText(value: string): string {
    if (!value) return value
    return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
}

function formatDuration(seconds: number | undefined, t: Translate): string {
    if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return ''
    const total = Math.floor(seconds)
    const minutes = Math.floor(total / 60)
    const rest = total % 60
    return minutes > 0
        ? `${minutes} ${t('мин')} ${rest} ${t('сек')}`
        : `${rest} ${t('сек')}`
}

function outcomeLabel(metrics: Record<string, unknown> | undefined, t: Translate): string {
    if (!metrics || typeof metrics.success !== 'boolean') return ''
    return metrics.success ? String(t('Успех')) : String(t('Неуспешно'))
}

function outcomeReason(metrics: Record<string, unknown> | undefined): string {
    const assessments = metrics?._assessments as Record<string, { rationale?: string, quote?: string }> | undefined
    const item = assessments?.success
    if (!item) return ''
    const parts: string[] = []
    if (item.rationale) parts.push(item.rationale)
    if (item.quote) parts.push(`«${item.quote}»`)
    return parts.join(' ')
}

function summaryOf(call: DistributionExportCall): string {
    const metrics = call.analytics?.metrics
    const fromMetrics = typeof metrics?.summary === 'string' ? metrics.summary.trim() : ''
    return fromMetrics || call.analytics?.summary?.trim() || ''
}

export function buildDistributionCallsSheet(
    calls: DistributionExportCall[],
    t: Translate,
): { rows: Array<Record<string, ExportCell>>, headers: string[] } {
    const headers = [
        '№',
        String(t('Дата')),
        String(t('Оператор')),
        String(t('Клиент')),
        String(t('Длительность')),
        String(t('Результат')),
        String(t('Саммари')),
        String(t('Итог обращения')),
    ]

    const rows = calls.map((call, index) => {
        const metrics = call.analytics?.metrics
        const row: Record<string, ExportCell> = {}
        for (const header of headers) row[header] = ''
        row['№'] = index + 1
        row[String(t('Дата'))] = call.createdAt ? (formatDate(call.createdAt) ?? '') : ''
        row[String(t('Оператор'))] = call.assistantName || call.operatorName || ''
        row[String(t('Клиент'))] = call.callerId || call.clientPhone || ''
        row[String(t('Длительность'))] = formatDuration(call.duration, t)
        row[String(t('Результат'))] = outcomeLabel(metrics, t)
        row[String(t('Саммари'))] = cellText(summaryOf(call))
        row[String(t('Итог обращения'))] = cellText(outcomeReason(metrics))
        return row
    })

    return { rows, headers }
}
