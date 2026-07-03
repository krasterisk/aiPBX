import type { CdrSource } from '@/entities/Report'

export const INSIGHT_DRILLDOWN_STORAGE_KEY = 'oa-insight-drilldown'

export interface InsightDrilldownPayload {
    startDate?: string
    endDate?: string
    projectId?: string
    userId?: string
    search?: string
    /** Optional CDR source filter when supported by reports API */
    source?: CdrSource | string
}

export function saveInsightDrilldown(payload: InsightDrilldownPayload): void {
    sessionStorage.setItem(INSIGHT_DRILLDOWN_STORAGE_KEY, JSON.stringify(payload))
}

export function consumeInsightDrilldown(): InsightDrilldownPayload | null {
    const raw = sessionStorage.getItem(INSIGHT_DRILLDOWN_STORAGE_KEY)
    if (!raw) return null
    sessionStorage.removeItem(INSIGHT_DRILLDOWN_STORAGE_KEY)
    try {
        return JSON.parse(raw) as InsightDrilldownPayload
    } catch {
        return null
    }
}

import type { OperatorInsight } from '@/entities/Report'

export function buildInsightDrilldownPayload(
    insight: Pick<OperatorInsight, 'evidence'>,
    queryParams?: {
        startDate?: string
        endDate?: string
        projectId?: string
        userId?: string
    },
): InsightDrilldownPayload | null {
    const channelId = insight.evidence.channelIds?.[0]
    const operator = insight.evidence.operators?.[0]
    if (!channelId && !operator) return null

    return {
        startDate: queryParams?.startDate,
        endDate: queryParams?.endDate,
        projectId: queryParams?.projectId,
        userId: queryParams?.userId,
        search: channelId ?? operator,
    }
}
