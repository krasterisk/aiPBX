import { useMemo } from 'react'
import {
    DashboardWidget,
    OperatorDashboardResponse,
    OperatorProject,
    DefaultMetricKey,
} from '@/entities/Report'

/**
 * Map default metric key → i18n label key
 */
export const DEFAULT_METRIC_LABELS: Record<DefaultMetricKey, string> = {
    greeting_quality: 'Качество приветствия',
    script_compliance: 'Следование скрипту',
    politeness_empathy: 'Вежливость и эмпатия',
    active_listening: 'Активное слушание',
    objection_handling: 'Работа с возражениями',
    product_knowledge: 'Знание продукта',
    problem_resolution: 'Решение проблемы',
    speech_clarity_pace: 'Темп речи',
    closing_quality: 'Качество завершения',
}

export interface WidgetDataResult {
    /** Single numeric value (for stat-card / sparkline) */
    value?: number
    /** Label */
    label?: string
    /** Array of { label, value } for bar-chart */
    barData?: Array<{ label: string, value: number }>
    /** Time series data for line-chart / sparkline */
    timeSeriesData?: Array<{ label: string, value: number }>
    /** Distribution data for pie-chart */
    pieData?: Array<{ id: number, value: number, label: string, color: string }>
    /** Heatmap data */
    heatmapData?: Array<{ date: string, callCount: number, avgScore: number }>
}

/**
 * Extracts the relevant data for a single widget from the dashboard response.
 */
export function useWidgetData(
    widget: DashboardWidget,
    dashboardData?: OperatorDashboardResponse,
    project?: OperatorProject,
): WidgetDataResult {
    return useMemo(() => {
        if (!dashboardData) return {}

        const { source, metricId, widgetType } = widget

        // ── Default metrics ─────────────────────────────────────────────────────
        if (source === 'default') {
            const metricKey = metricId as DefaultMetricKey
            const value = dashboardData.aggregatedMetrics?.[metricKey]

            switch (widgetType) {
                case 'stat-card':
                    return { value: value ?? 0, label: DEFAULT_METRIC_LABELS[metricKey] }

                case 'bar-chart': {
                    // Show all visible default metrics
                    const visibleKeys = project?.visibleDefaultMetrics ?? Object.keys(DEFAULT_METRIC_LABELS) as DefaultMetricKey[]
                    const barData = visibleKeys.map(key => ({
                        label: DEFAULT_METRIC_LABELS[key] ?? key,
                        value: dashboardData.aggregatedMetrics?.[key] ?? 0,
                    }))
                    return { barData }
                }

                case 'line-chart': {
                    const timeSeriesData = dashboardData.timeSeries?.monthly?.map(p => ({
                        label: p.label,
                        value: p.callsCount,
                    })) ?? []
                    return { timeSeriesData }
                }

                case 'pie-chart': {
                    if (metricId === 'sentiment') {
                        return {
                            pieData: [
                                { id: 0, value: dashboardData.sentimentDistribution?.positive ?? 0, label: 'Positive', color: 'var(--status-success)' },
                                { id: 1, value: dashboardData.sentimentDistribution?.neutral ?? 0, label: 'Neutral', color: 'var(--status-warning)' },
                                { id: 2, value: dashboardData.sentimentDistribution?.negative ?? 0, label: 'Negative', color: 'var(--status-error)' },
                            ]
                        }
                    }
                    // success rate pie
                    const rate = dashboardData.successRate
                        ? (dashboardData.successRate > 1 ? dashboardData.successRate : dashboardData.successRate * 100)
                        : 0
                    return {
                        pieData: [
                            { id: 0, value: Math.round(rate), label: 'Успех', color: 'var(--status-success)' },
                            { id: 1, value: 100 - Math.round(rate), label: 'Нет', color: 'var(--icon-secondary)' },
                        ]
                    }
                }

                case 'sparkline': {
                    const timeSeriesData = dashboardData.timeSeries?.monthly?.map(p => ({
                        label: p.label,
                        value: p.avgScore ?? 0,
                    })) ?? []
                    return { value: value ?? 0, timeSeriesData }
                }

                case 'heatmap': {
                    const heatmapData = dashboardData.timeSeries?.daily?.map(p => ({
                        date: p.label,
                        callCount: p.callsCount ?? 0,
                        avgScore: p.avgScore ?? (dashboardData.averageScore ?? 0),
                    })) ?? []
                    return { heatmapData }
                }

                default:
                    return { value: value ?? 0 }
            }
        }

        // ── Custom metrics ──────────────────────────────────────────────────────
        if (source === 'custom') {
            return extractCustomWidgetData(widget, dashboardData, project)
        }

        return { value: 0, label: widget.title }
    }, [widget, dashboardData, project])
}

const PIE_COLORS = [
    'var(--accent-redesigned)',
    'var(--status-success)',
    'var(--status-warning)',
    'var(--status-error)',
    'var(--icon-secondary)',
]

/**
 * Pure helper — exported for unit tests.
 */
export function extractCustomWidgetData(
    widget: DashboardWidget,
    dashboardData: OperatorDashboardResponse,
    project?: OperatorProject,
): WidgetDataResult {
    const metric = project?.customMetricsSchema?.find(m => m.id === widget.metricId)
    const agg = dashboardData.customMetricsAggregated?.[widget.metricId]
    const label = metric?.name ?? widget.title

    if (!agg) {
        return { label }
    }

    switch (widget.widgetType) {
        case 'stat-card':
        case 'sparkline': {
            if (agg.type === 'boolean' || agg.type === 'number') {
                return { value: agg.value ?? 0, label }
            }
            if (agg.distribution) {
                const top = Object.entries(agg.distribution)
                    .sort((a, b) => b[1] - a[1])[0]
                return { value: top?.[1] ?? 0, label: top?.[0] ?? label }
            }
            return { value: 0, label }
        }

        case 'bar-chart':
        case 'tag-cloud': {
            if (agg.distribution) {
                return {
                    label,
                    barData: Object.entries(agg.distribution).map(([entryLabel, value]) => ({
                        label: entryLabel,
                        value,
                    })),
                }
            }
            return {
                label,
                barData: [{ label, value: agg.value ?? 0 }],
            }
        }

        case 'pie-chart': {
            if (agg.distribution) {
                return {
                    label,
                    pieData: Object.entries(agg.distribution).map(([entryLabel, value], index) => ({
                        id: index,
                        value,
                        label: entryLabel,
                        color: PIE_COLORS[index % PIE_COLORS.length],
                    })),
                }
            }
            if (agg.type === 'boolean' && agg.value != null) {
                return {
                    label,
                    pieData: [
                        { id: 0, value: agg.value, label: 'Да', color: 'var(--status-success)' },
                        { id: 1, value: 100 - agg.value, label: 'Нет', color: 'var(--icon-secondary)' },
                    ],
                }
            }
            return { label, pieData: [] }
        }

        case 'line-chart':
            return {
                label,
                timeSeriesData: dashboardData.timeSeries?.monthly?.map(point => ({
                    label: point.label,
                    value: point.callsCount,
                })) ?? [],
            }

        case 'heatmap':
            return {
                label,
                heatmapData: dashboardData.timeSeries?.daily?.map(point => ({
                    date: point.label,
                    callCount: point.callsCount ?? 0,
                    avgScore: point.avgScore ?? (dashboardData.averageScore ?? 0),
                })) ?? [],
            }

        default:
            return { value: agg.value ?? 0, label }
    }
}
