import type { DefaultMetricKey, MetricPolarity } from '@/entities/Report'

export const normalizeRate = (rate?: number): number => {
    if (!rate) return 0
    return rate > 1 ? rate : rate * 100
}

export const ALL_DEFAULT_METRICS: Array<{
    key: DefaultMetricKey
    labelKey: string
    descriptionKey: string
}> = [
    {
        key: 'greeting_quality',
        labelKey: 'Качество приветствия',
        descriptionKey: 'METRIC_DESC_GREETING',
    },
    {
        key: 'script_compliance',
        labelKey: 'Следование скрипту',
        descriptionKey: 'METRIC_DESC_SCRIPT',
    },
    {
        key: 'politeness_empathy',
        labelKey: 'Вежливость и эмпатия',
        descriptionKey: 'METRIC_DESC_POLITENESS',
    },
    {
        key: 'active_listening',
        labelKey: 'Активное слушание',
        descriptionKey: 'METRIC_DESC_LISTENING',
    },
    {
        key: 'objection_handling',
        labelKey: 'Работа с возражениями',
        descriptionKey: 'METRIC_DESC_OBJECTIONS',
    },
    {
        key: 'product_knowledge',
        labelKey: 'Знание продукта',
        descriptionKey: 'METRIC_DESC_PRODUCT',
    },
    {
        key: 'problem_resolution',
        labelKey: 'Решение проблемы',
        descriptionKey: 'METRIC_DESC_RESOLUTION',
    },
    {
        key: 'speech_clarity_pace',
        labelKey: 'Темп речи',
        descriptionKey: 'METRIC_DESC_SPEECH',
    },
    {
        key: 'closing_quality',
        labelKey: 'Качество завершения',
        descriptionKey: 'METRIC_DESC_CLOSING',
    },
]

/** Always-on summary outputs (not toggled with the 9 quality metrics). */
export const LOCKED_SUMMARY_METRICS: Array<{
    key: 'average_score' | 'sentiment' | 'summary'
    labelKey: string
    descriptionKey: string
}> = [
    {
        key: 'average_score',
        labelKey: 'Средняя оценка',
        descriptionKey: 'METRIC_DESC_AVERAGE_SCORE',
    },
    {
        key: 'sentiment',
        labelKey: 'Настроение',
        descriptionKey: 'METRIC_DESC_SENTIMENT',
    },
    {
        key: 'summary',
        labelKey: 'Саммари',
        descriptionKey: 'METRIC_DESC_SUMMARY',
    },
]

/** Summary metrics shown in operator evidence (not in the 0–100 quality rubric). */
export const SUMMARY_METRIC_LABELS: Record<string, string> = {
    csat: 'Удовлетворённость клиента (CSAT)',
    customer_sentiment: 'Эмоциональный настрой клиента',
    success: 'Итог обращения',
}

export type ScoreTextVariant = 'success' | 'warning' | 'error' | 'primary'

export function getDefaultMetricLabelKey(metricId: string): string | undefined {
    return ALL_DEFAULT_METRICS.find(m => m.key === metricId)?.labelKey
}

export function getDefaultMetricDescriptionKey(metricId: string): string | undefined {
    return ALL_DEFAULT_METRICS.find(m => m.key === metricId)?.descriptionKey
}

export function getMetricLabelKey(metricId: string): string | undefined {
    return getDefaultMetricLabelKey(metricId) ?? SUMMARY_METRIC_LABELS[metricId]
}

export function metricVisual(
    value: number,
    opts: { min?: number, max?: number, polarity?: MetricPolarity, isRate?: boolean },
): { pct: number, color: string } {
    const min = opts.isRate ? 0 : (opts.min ?? 0)
    const max = opts.isRate ? 100 : (opts.max ?? 100)
    const span = max - min > 0 ? max - min : 100
    const pct = Math.max(0, Math.min(100, ((value - min) / span) * 100))
    const polarity = opts.polarity ?? 'positive'
    const goodness = polarity === 'negative' ? 100 - pct : pct
    const tone = polarity === 'neutral'
        ? 'neutral'
        : goodness >= 80 ? 'high' : goodness >= 50 ? 'mid' : 'low'
    const color = tone === 'high'
        ? 'var(--status-success)'
        : tone === 'mid'
            ? 'var(--status-warning)'
            : tone === 'low'
                ? 'var(--status-error)'
                : 'var(--accent, #6366f1)'
    return { pct, color }
}

export function scoreVariant(value: number): ScoreTextVariant {
    return value >= 80 ? 'success' : value >= 50 ? 'warning' : 'error'
}

export function scoreColor(value: number): string {
    return metricVisual(value, { isRate: true }).color
}

/** CSAT is 1–5; do not treat it as a 0–100 quality score. */
export function csatVariant(value: number): ScoreTextVariant {
    if (value >= 4) return 'success'
    if (value >= 3) return 'warning'
    return 'error'
}

/**
 * Format an evidence-metric average for the operator panel.
 * Summary metrics use dedicated scales; quality metrics stay 0–100.
 * Boolean custom metrics are shown as a % rate when evidence values are boolean.
 */
export function formatEvidenceMetricAverage(
    metricId: string,
    average: number | null | undefined,
    t: (key: string) => string,
    opts?: { evidenceValues?: Array<number | boolean | string | null> },
): { text: string, variant: ScoreTextVariant, labelKey: string } {
    const evidenceValues = opts?.evidenceValues ?? []
    const booleanEvidence = evidenceValues.filter(v => typeof v === 'boolean')
    const looksBoolean = booleanEvidence.length > 0 &&
        booleanEvidence.length === evidenceValues.filter(v => v != null && v !== '').length

    if (looksBoolean && average != null && !Number.isNaN(average)) {
        return {
            text: `${Math.round(average)}%`,
            variant: scoreVariant(average),
            labelKey: 'Доля «да»',
        }
    }

    if (average == null || Number.isNaN(average)) {
        return { text: '-', variant: 'primary', labelKey: 'Средний балл метрики' }
    }

    if (metricId === 'csat') {
        return {
            text: `${average.toFixed(1)} / 5`,
            variant: csatVariant(average),
            labelKey: 'Средний CSAT',
        }
    }

    if (metricId === 'success') {
        return {
            text: `${Math.round(average)}%`,
            variant: scoreVariant(average),
            labelKey: 'Доля успешных обращений',
        }
    }

    if (metricId === 'customer_sentiment') {
        const labelKey = average >= 67
            ? 'Positive'
            : average >= 34
                ? 'Neutral'
                : 'Negative'
        return {
            text: String(t(labelKey)),
            variant: scoreVariant(average),
            labelKey: 'Преобладающий настрой',
        }
    }

    return {
        text: Number.isInteger(average) ? String(average) : average.toFixed(1),
        variant: scoreVariant(average),
        labelKey: 'Средний балл метрики',
    }
}

export function formatEvidenceMetricValue(
    value: number | boolean | string | null | undefined,
    t: (key: string) => string,
): { text: string, variant: ScoreTextVariant } | null {
    if (value == null || value === '') return null
    if (typeof value === 'boolean') {
        return {
            text: String(t(value ? 'Да' : 'Нет')),
            variant: value ? 'success' : 'error',
        }
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
        return { text: String(value), variant: scoreVariant(value) }
    }
    return { text: String(value), variant: 'primary' }
}
