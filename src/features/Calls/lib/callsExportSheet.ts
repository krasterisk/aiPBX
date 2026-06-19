import type { TFunction } from 'i18next'
import type {
    AnalyticsMetrics,
    DefaultMetricKey,
    Report,
    StoredMetricMeta,
} from '@/entities/Report/model/types/report'
import { formatDate } from '@/shared/lib/functions/formatDate'
import { formatTime } from '@/shared/lib/functions/formatTime'
import { formatDisplayMoney } from '@/shared/lib/functions/formatDisplayMoney'
import { reportDisplayMoneyInput } from '@/entities/Report'

const EXCEL_CELL_MAX = 32767

const OPERATOR_METRIC_KEYS: Array<{ key: DefaultMetricKey, labelKey: string }> = [
    { key: 'greeting_quality', labelKey: 'Качество приветствия' },
    { key: 'script_compliance', labelKey: 'Следование скрипту' },
    { key: 'politeness_empathy', labelKey: 'Вежливость и эмпатия' },
    { key: 'active_listening', labelKey: 'Активное слушание' },
    { key: 'objection_handling', labelKey: 'Работа с возражениями' },
    { key: 'product_knowledge', labelKey: 'Знание продукта' },
    { key: 'problem_resolution', labelKey: 'Решение проблемы' },
    { key: 'speech_clarity_pace', labelKey: 'Темп речи' },
    { key: 'closing_quality', labelKey: 'Качество завершения' },
]

const KNOWN_OPERATOR_KEYS = new Set<string>([
    ...OPERATOR_METRIC_KEYS.map(m => m.key),
    'customer_sentiment', 'summary', 'success', 'csat', 'custom_metrics', 'metrics',
])

const isOperatorMetrics = (metrics: AnalyticsMetrics): boolean =>
    typeof metrics.greeting_quality === 'number'

const isInternalMetaKey = (key: string): boolean => key.startsWith('_')

const formatBool = (value: boolean | undefined | null, t: TFunction): string => {
    if (value == null) return ''
    return value ? String(t('Да')) : String(t('Нет'))
}

const formatMetricValue = (value: unknown, t: TFunction): string | number => {
    if (value == null) return ''
    if (typeof value === 'boolean') return formatBool(value, t)
    if (typeof value === 'number') return value
    return String(value)
}

const getSummary = (report: Report): string => {
    const metrics = report.analytics?.metrics
    if (!metrics) return report.analytics?.summary?.trim() ?? ''
    return (
        metrics.summary?.trim()
        || metrics.scenario_analysis?.summary?.trim()
        || report.analytics?.summary?.trim()
        || ''
    )
}

const getSentiment = (report: Report): string => {
    const metrics = report.analytics?.metrics
    return (
        metrics?.customer_sentiment
        || metrics?.user_satisfaction?.sentiment
        || report.analytics?.sentiment
        || ''
    )
}

const formatResult = (metrics: AnalyticsMetrics | undefined, t: TFunction): string => {
    if (!metrics) return ''
    if (metrics.scenario_analysis?.success != null) {
        return metrics.scenario_analysis.success ? String(t('Успех')) : String(t('Эскалация'))
    }
    if (metrics.success != null) {
        return metrics.success ? String(t('Успех')) : String(t('Нет'))
    }
    return ''
}

const truncateCell = (text: string): string =>
    text.length > EXCEL_CELL_MAX ? text.slice(0, EXCEL_CELL_MAX - 1) + '…' : text

const extractCustomEntries = (
    metrics: AnalyticsMetrics,
): Array<[string, unknown, StoredMetricMeta | undefined]> => {
    const meta = metrics._custom_meta
    if (metrics.custom_metrics && typeof metrics.custom_metrics === 'object') {
        return Object.entries(metrics.custom_metrics)
            .filter(([key]) => !isInternalMetaKey(key))
            .map(([key, value]): [string, unknown, StoredMetricMeta | undefined] => [key, value, meta?.[key]])
    }
    return Object.entries(metrics)
        .filter(([key]) => !KNOWN_OPERATOR_KEYS.has(key) && !isInternalMetaKey(key))
        .map(([key, value]): [string, unknown, StoredMetricMeta | undefined] => [key, value, meta?.[key]])
}

const customColumnHeader = (id: string, meta: StoredMetricMeta | undefined, t: TFunction): string => {
    const name = meta?.name || id
    return `${String(t('Кастомные метрики'))}: ${name}`
}

const formatAssessments = (
    metrics: AnalyticsMetrics | undefined,
    labelByKey: Record<string, string>,
    t: TFunction,
): string => {
    const assessments = metrics?._assessments as Record<string, { rationale?: string, quote?: string }> | undefined
    if (!assessments) return ''

    const lines = Object.entries(assessments)
        .filter(([, a]) => a?.rationale || a?.quote)
        .map(([key, a]) => {
            const label = labelByKey[key] || key
            const parts: string[] = []
            if (a?.rationale) parts.push(a.rationale)
            if (a?.quote) parts.push(`«${a.quote}»`)
            return `${label}: ${parts.join(' ')}`
        })

    return truncateCell(lines.join('\n'))
}

const collectCustomMetricColumns = (
    reports: Report[],
    t: TFunction,
): Map<string, string> => {
    const columns = new Map<string, string>()
    for (const report of reports) {
        const metrics = report.analytics?.metrics
        if (!metrics || !isOperatorMetrics(metrics)) continue
        for (const [id, , meta] of extractCustomEntries(metrics)) {
            if (!columns.has(id)) {
                columns.set(id, customColumnHeader(id, meta, t))
            }
        }
    }
    return columns
}

export type ExportCell = string | number

export function buildCallsExportSheet(
    reports: Report[],
    t: TFunction,
): { rows: Record<string, ExportCell>[], headers: string[] } {
    const customColumns = collectCustomMetricColumns(reports, t)

    const operatorMetricHeaders = OPERATOR_METRIC_KEYS.map(m => String(t(m.labelKey)))

    const analyticsHeaders = [
        String(t('Саммари')),
        String(t('Качество транскрипции')),
        String(t('EXPORT_KEYWORDS')),
        String(t('Обоснование метрик')),
        String(t('Транскрипт')),
    ]

    const botHeaders = [
        String(t('Уровень автоматизации')),
        String(t('Уровень эскалации')),
        String(t('Экономия затрат')),
        String(t('Причина эскалации')),
        String(t('Отказ')),
        String(t('Фрустрация')),
        String(t('Среднее кол-во ходов')),
        String(t('Завершение диалога')),
        String(t('Извлечение сущностей')),
        String(t('Удержание контекста')),
        String(t('Распознавание намерений')),
    ]

    const baseHeaders = [
        '№',
        String(t('Дата')),
        String(t('Ассистент')),
        String(t('Звонивший')),
        String(t('Источник')),
        String(t('Длительность')),
        String(t('Токены')),
        String(t('Стоимость')),
        'CSAT',
        String(t('Настроение')),
        String(t('Результат')),
    ]

    const headers = [
        ...baseHeaders,
        ...analyticsHeaders,
        ...operatorMetricHeaders,
        ...Array.from(customColumns.values()),
        ...botHeaders,
    ]

    const operatorLabelByKey = Object.fromEntries(
        OPERATOR_METRIC_KEYS.map(m => [m.key, String(t(m.labelKey))]),
    ) as Record<string, string>

    const rows = reports.map((report, index) => {
        const metrics = report.analytics?.metrics
        const row: Record<string, ExportCell> = {}

        for (const h of headers) row[h] = ''

        row['№'] = index + 1
        row[String(t('Дата'))] = report.createdAt ? formatDate(report.createdAt) : ''
        row[String(t('Ассистент'))] = report.assistantName ?? ''
        row[String(t('Звонивший'))] = report.callerId ?? ''
        row[String(t('Источник'))] = report.source ?? ''
        row[String(t('Длительность'))] = report.duration ? (formatTime(report.duration, t) ?? '') : ''
        row[String(t('Токены'))] = report.tokens ?? ''
        row[String(t('Стоимость'))] = (report.cost || report.amountCurrency || report.billingRecords?.length)
            ? formatDisplayMoney(reportDisplayMoneyInput(report), 4)
            : ''
        row.CSAT = report.analytics?.csat ?? metrics?.csat ?? ''
        row[String(t('Настроение'))] = getSentiment(report)
        row[String(t('Результат'))] = formatResult(metrics, t)

        if (metrics || report.transcription) {
            row[String(t('Саммари'))] = truncateCell(getSummary(report))
            row[String(t('Качество транскрипции'))] =
                report.transcriptionQuality || metrics?._quality?.quality || ''
            row[String(t('EXPORT_KEYWORDS'))] =
                metrics?._topics?.keywords?.join(', ') ?? ''
            row[String(t('Транскрипт'))] = truncateCell(report.transcription?.trim() ?? '')
        }

        if (metrics && isOperatorMetrics(metrics)) {
            const customLabelByKey: Record<string, string> = { ...operatorLabelByKey }
            for (const [id, header] of Array.from(customColumns)) {
                customLabelByKey[id] = header.replace(`${String(t('Кастомные метрики'))}: `, '')
            }

            row[String(t('Обоснование метрик'))] = formatAssessments(metrics, customLabelByKey, t)

            for (const { key, labelKey } of OPERATOR_METRIC_KEYS) {
                const header = String(t(labelKey))
                const val = metrics[key]
                row[header] = val != null ? formatMetricValue(val, t) : ''
            }

            for (const [id, header] of Array.from(customColumns)) {
                const entry = extractCustomEntries(metrics).find(([key]) => key === id)
                row[header] = entry ? formatMetricValue(entry[1], t) : ''
            }
        } else if (metrics) {
            row[String(t('Обоснование метрик'))] = ''

            const bi = metrics.business_impact
            const sa = metrics.scenario_analysis
            const us = metrics.user_satisfaction
            const ae = metrics.accuracy_and_efficiency

            row[String(t('Уровень автоматизации'))] = bi?.automation_rate ?? ''
            row[String(t('Уровень эскалации'))] = bi?.escalation_rate ?? ''
            row[String(t('Экономия затрат'))] = bi?.cost_savings_estimated ?? ''
            row[String(t('Причина эскалации'))] = sa?.escalation_reason ?? ''
            row[String(t('Отказ'))] = formatBool(us?.bail_out_rate, t)
            row[String(t('Фрустрация'))] = formatBool(us?.frustration_detected, t)
            row[String(t('Среднее кол-во ходов'))] = ae?.average_turns ?? ''
            row[String(t('Завершение диалога'))] = ae?.dialog_completion_rate ?? ''
            row[String(t('Извлечение сущностей'))] = ae?.entity_extraction_rate ?? ''
            row[String(t('Удержание контекста'))] = ae?.context_retention_score ?? ''
            row[String(t('Распознавание намерений'))] = ae?.intent_recognition_rate ?? ''
        }

        return row
    })

    return { rows, headers }
}
