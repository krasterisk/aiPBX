import type { OperatorInsight, OperatorInsightsResponse } from './report'

export interface InsightPeriod { startDate: string, endDate: string }
export type DashboardInsight = OperatorInsight & { evidence: OperatorInsight['evidence'] & {
    factId?: string
    metricId?: string
    origin?: string
    unit?: 'points' | 'percent'
    assessed?: number
    applicable?: number
    notApplicable?: number
    notRecorded?: number
    distribution?: Record<string, number>
    previousValue?: number
    delta?: number
    period?: InsightPeriod
    previousPeriod?: InsightPeriod
    previousChannelIds?: string[]
    rule?: { type: string, weight: number, included: boolean, normalization: unknown }
} }
export type DashboardInsightsResponse = Omit<OperatorInsightsResponse, 'insights'> & {
    insights: DashboardInsight[]
    comparison?: { current: InsightPeriod, previous: InsightPeriod | null, timezone: string }
}
