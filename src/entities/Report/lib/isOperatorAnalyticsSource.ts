/**
 * Single source of truth for CDR `source` values produced by operator analytics.
 * Mirrors the backend `operator-analytics/lib/analytics-source.ts`.
 */
export const OPERATOR_CDR_SOURCE = {
    EXTERNAL_API: 'external-api',
    EXTERNAL_FRONT: 'external-front',
} as const

export const isOperatorAnalyticsSource = (source?: string): boolean =>
    source === OPERATOR_CDR_SOURCE.EXTERNAL_API || source === OPERATOR_CDR_SOURCE.EXTERNAL_FRONT
