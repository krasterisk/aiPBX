import type { Report, ReportDialog, QualityDetail } from '@/entities/Report'

import { JOURNAL_METRIC_LABELS } from '@/entities/Report'
export { JOURNAL_METRIC_LABELS } from '@/entities/Report/model/types/quality'
export interface JournalMetric {
    id: string
    label: string
    value: string | number | boolean
    min?: number
    max?: number
    unit?: string
    polarity?: 'positive' | 'negative' | 'neutral'
    rationale?: string
    quote?: string
    status?: string
    included?: boolean
    weight?: number
    normalized?: number | null
    source?: string
}
export function qualityJournalMetrics(detail: QualityDetail): JournalMetric[] {
    return (detail.evaluation?.result.criteria ?? []).map(item => {
        const rule = detail.criteria.find(rule => rule.id === item.id && rule.origin === item.origin)
        const n = rule?.normalization
        return {
 id: `${item.origin}:${item.id}`,
label: item.origin === 'default' ? JOURNAL_METRIC_LABELS[item.id] || item.id : rule?.name || item.id,
            value: item.value ?? '—',
status: item.status,
included: item.included,
weight: item.weight,
normalized: item.normalized,
            source: item.source,
rationale: item.rationale,
quote: item.quote,
            ...(n?.kind === 'linear' ? { min: n.min, max: n.max, polarity: n.inverted ? 'negative' as const : 'positive' as const } : {})
}
    })
}
export function journalMetrics(report: Report): JournalMetric[] {
    const metrics = report.analytics?.metrics
    if (!metrics) return []
    const result: JournalMetric[] = []
    const add = (id: string, value: unknown, label: string, scale: Partial<JournalMetric> = {}) => {
        if (!['number', 'string', 'boolean'].includes(typeof value) || (typeof value === 'number' && !Number.isFinite(value))) return
        const assessment = metrics._assessments?.[id]
        result.push({ id, label, value: value as string | number | boolean, ...scale, rationale: assessment?.rationale, quote: assessment?.quote || metrics._evidence?.[id] })
    }
    for (const [id, label] of Object.entries(JOURNAL_METRIC_LABELS)) add(id, metrics[id as keyof typeof metrics], label, { min: 0, max: 100, unit: '%', polarity: 'positive' })
    const reserved = new Set([...Object.keys(JOURNAL_METRIC_LABELS), 'customer_sentiment', 'summary', 'success', 'csat', 'custom_metrics', 'metrics', 'user_satisfaction'])
    const custom = metrics.custom_metrics ?? (metrics as Record<string, unknown>).metrics ?? Object.fromEntries(Object.entries(metrics).filter(([id]) => !reserved.has(id) && !id.startsWith('_')))
    if (custom && typeof custom === 'object' && !Array.isArray(custom)) {
        for (const [id, value] of Object.entries(custom)) {
            if (id.startsWith('_') || JOURNAL_METRIC_LABELS[id]) continue
            const meta = metrics._custom_meta?.[id]
            add(id, value, meta?.name || id, { min: meta?.min, max: meta?.max, unit: meta?.unit, polarity: meta?.polarity })
        }
    }
    // Bot sections preserve their original units; no invented percentage conversion.
    const botLabels: Record<string, string> = { escalation_rate: 'Эскалация', automation_rate: 'Автоматизация', cost_savings_estimated: 'Экономия затрат', average_turns: 'Количество реплик', dialog_completion_rate: 'Завершение диалога', entity_extraction_rate: 'Извлечение сущностей', context_retention_score: 'Удержание контекста', intent_recognition_rate: 'Распознавание намерений', mos: 'Качество речи (MOS)', wer_estimated: 'Ошибки распознавания (WER)', self_recovery_rate: 'Самостоятельное восстановление', response_latency_score: 'Скорость ответа', frustration_detected: 'Раздражение клиента', bail_out_rate: 'Прерывание диалога' }
    for (const section of ['business_impact', 'accuracy_and_efficiency', 'speech_and_interaction_quality', 'user_satisfaction']) {
        const values = (metrics as Record<string, unknown>)[section]
        if (values && typeof values === 'object') {
for (const [id, value] of Object.entries(values)) {
            if (id !== 'csat' && id !== 'sentiment') add(`${section}.${id}`, value, botLabels[id] || id)
        }
}
    }
    return result
}
export function metricPercent(metric: JournalMetric): number | null {
    if (typeof metric.value !== 'number' || metric.min == null || metric.max == null || metric.max <= metric.min) return null
    return Math.round(Math.max(0, Math.min(100, (metric.value - metric.min) / (metric.max - metric.min) * 100)))
}
export function journalTurns(report: Report, dialogs?: ReportDialog[]) {
    if (report.transcription) {
        try {
            const parsed: unknown = JSON.parse(report.transcription)
            if (Array.isArray(parsed) && parsed.every(line => line && typeof line.text === 'string')) {
                return parsed.map((line, index) => ({ id: String(index), role: String(line.speaker || ''), text: String(line.text), start: typeof line.start === 'number' && Number.isFinite(line.start) && line.start >= 0 ? line.start as number : undefined }))
            }
        } catch { /* Preserve plain transcription below. */ }
        return [{ id: 'plain', role: '', text: report.transcription, start: undefined }]
    }
    const first = dialogs?.[0] ? Date.parse(dialogs[0].timestamp) : NaN
    return (dialogs ?? []).map((line, index) => ({ id: String(index), role: line.role, text: line.text, start: Number.isFinite(first) && Number.isFinite(Date.parse(line.timestamp)) ? Math.max(0, (Date.parse(line.timestamp) - first) / 1000) : undefined }))
}
