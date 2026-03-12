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
                    const timeSeriesData = dashboardData.timeSeries?.map(p => ({
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
                    const timeSeriesData = dashboardData.timeSeries?.map(p => ({
                        label: p.label,
                        value: p.avgScore ?? 0,
                    })) ?? []
                    return { value: value ?? 0, timeSeriesData }
                }

                case 'heatmap': {
                    const heatmapData = dashboardData.timeSeries?.map(p => ({
                        date: p.label,
                        callCount: p.callsCount ?? 0,
                        avgScore: dashboardData.averageScore ?? 0,
                    })) ?? []
                    return { heatmapData }
                }

                default:
                    return { value: value ?? 0 }
            }
        }

        // ── Custom metrics ──────────────────────────────────────────────────────
        // TODO: When backend returns aggregatedCustomMetrics, use them here
        // For now return a stub
        return { value: 0, label: widget.title }
    }, [widget, dashboardData, project])
}
