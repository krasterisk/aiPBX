import {
    extractCustomWidgetData,
    type WidgetDataResult,
} from './useWidgetData'
import type { DashboardWidget, OperatorDashboardResponse, OperatorProject } from '@/entities/Report'

const baseWidget: DashboardWidget = {
    id: 'w1',
    title: 'Upsell',
    source: 'custom',
    metricId: 'upsell_attempt',
    widgetType: 'stat-card',
    size: 'md',
    position: 0,
}

const baseDashboard = {
    totalAnalyzed: 10,
    averageScore: 80,
    successRate: 0.9,
    averageDuration: 120,
    totalCost: 0,
    aggregatedMetrics: {
        greeting_quality: 0,
        script_compliance: 0,
        politeness_empathy: 0,
        active_listening: 0,
        objection_handling: 0,
        product_knowledge: 0,
        problem_resolution: 0,
        speech_clarity_pace: 0,
        closing_quality: 0,
    },
    sentimentDistribution: { positive: 5, neutral: 3, negative: 2 },
    timeSeries: { monthly: [], daily: [] },
    insightsAvailable: false,
} satisfies OperatorDashboardResponse

const project: OperatorProject = {
    id: 'p1',
    name: 'Test',
    customMetricsSchema: [
        {
            id: 'upsell_attempt',
            name: 'Попытка апселла',
            type: 'boolean',
            description: 'Была ли попытка',
        },
        {
            id: 'csat_score',
            name: 'CSAT',
            type: 'number',
            description: 'Оценка',
            max: 10,
        },
        {
            id: 'outcome',
            name: 'Исход',
            type: 'enum',
            description: 'Результат',
            enumValues: ['sale', 'callback', 'reject'],
        },
    ],
} as OperatorProject

describe('extractCustomWidgetData', () => {
    it('maps boolean metric to stat-card percent', () => {
        const data = {
            ...baseDashboard,
            customMetricsAggregated: {
                upsell_attempt: { type: 'boolean' as const, value: 42.5 },
            },
        } satisfies OperatorDashboardResponse
        const result = extractCustomWidgetData(baseWidget, data, project)
        expect(result.value).toBe(42.5)
        expect(result.label).toBe('Попытка апселла')
    })

    it('maps number metric to stat-card average', () => {
        const widget: DashboardWidget = { ...baseWidget, metricId: 'csat_score' }
        const data = {
            ...baseDashboard,
            customMetricsAggregated: {
                csat_score: { type: 'number' as const, value: 7.2 },
            },
        } satisfies OperatorDashboardResponse
        const result = extractCustomWidgetData(widget, data, project)
        expect(result.value).toBe(7.2)
    })

    it('maps enum distribution to pie chart', () => {
        const widget: DashboardWidget = { ...baseWidget, metricId: 'outcome', widgetType: 'pie-chart' }
        const data = {
            ...baseDashboard,
            customMetricsAggregated: {
                outcome: {
                    type: 'enum' as const,
                    distribution: { sale: 3, callback: 2, reject: 1 },
                },
            },
        } satisfies OperatorDashboardResponse
        const result: WidgetDataResult = extractCustomWidgetData(widget, data, project)
        expect(result.pieData).toHaveLength(3)
        expect(result.pieData?.find(p => p.label === 'sale')?.value).toBe(3)
    })

    it('returns label only when no aggregation data', () => {
        const result = extractCustomWidgetData(baseWidget, baseDashboard, project)
        expect(result.value).toBeUndefined()
        expect(result.label).toBe('Попытка апселла')
    })
})
