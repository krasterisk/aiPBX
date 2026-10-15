import { ALL_DEFAULT_METRICS, SUMMARY_METRIC_LABELS } from './metricVisual'

/** API evidence can contain either an identifier or a generated display name. */
export const INSIGHT_METRICS = [
    ...ALL_DEFAULT_METRICS.map(({ key, labelKey }) => ({ labelKey, aliases: [key] })),
    ...Object.entries(SUMMARY_METRIC_LABELS).map(([key, labelKey]) => ({ labelKey, aliases: [key] })),
    { labelKey: 'Средний балл', aliases: ['avgScore', 'averageScore', 'average_score', 'Average score', 'Avg Score'] },
    { labelKey: 'Доля успешных обращений', aliases: ['successRate', 'success_rate', 'Success rate', 'Successful request rate'] },
    { labelKey: 'Неуспешные звонки', aliases: ['unsuccessfulCount', 'unsuccessful.count', 'Unsuccessful calls'] },
    { labelKey: 'Успешные звонки', aliases: ['successfulCount', 'Successful calls'] },
    { labelKey: 'Всего звонков', aliases: ['calls', 'callsCount', 'totalAnalyzed', 'sampleSize', 'Total calls', 'Sample size'] },
    { labelKey: 'Средняя длительность', aliases: ['avgDuration', 'averageDuration', 'Average duration', 'Average call duration'] },
    { labelKey: 'Эмоциональный настрой клиента', aliases: ['sentiment', 'sentimentDistribution', 'Customer Sentiment'] },
    { labelKey: 'Позитивное настроение', aliases: ['positive', 'sentiment.positive'] },
    { labelKey: 'Нейтральное настроение', aliases: ['neutral', 'sentiment.neutral'] },
    { labelKey: 'Негативное настроение', aliases: ['negative', 'sentiment.negative'] },
    { labelKey: 'INSIGHT_EXCLUDED_CALLS', aliases: ['excludedLowQualityCount', 'Excluded low quality calls', 'Excluded low-quality calls'] },
    { labelKey: 'INSIGHT_SUCCESS_RATE_CHANGE', aliases: ['successRatePp'] },
]

export function createInsightMetricNames(
    translate: (key: string) => string,
    translateEnglish: (key: string) => string,
    customNames: Record<string, string> = {},
): Record<string, string> {
    const names: Record<string, string> = {}
    for (const { labelKey, aliases } of INSIGHT_METRICS) {
        const label = translate(labelKey)
        for (const alias of [...aliases, labelKey, translateEnglish(labelKey), label]) {
            names[alias] = label
            names[alias.toLowerCase()] = label
        }
    }
    // Configured project names take precedence over built-in aliases.
    return { ...names, ...customNames }
}

export function insightMetricLabel(metric: string, names: Record<string, string>): string {
    const label = metric.trim()
    return names[label] ?? names[label.toLowerCase()] ?? metric
}

export function applyInsightMetricNames(text: string, names: Record<string, string>): string {
    const aliases = Object.keys(names)
        .filter(alias => alias && alias !== names[alias])
        .sort((a, b) => b.length - a.length)
        .map(alias => alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    if (!aliases.length) return text
    // Unicode boundaries also support Russian and Chinese labels. A single pass
    // prevents replacing text inside a configured name a second time.
    return text.replace(new RegExp(`(^|[^\\p{L}\\p{N}_])(${aliases.join('|')})(?=$|[^\\p{L}\\p{N}_])`, 'gu'),
        (_match, prefix: string, alias: string) => `${prefix}${names[alias]}`)
}
