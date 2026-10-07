import type { DefaultMetricKey } from '@/entities/Report'
import { ALL_DEFAULT_METRICS } from './metricVisual'

/** Uses the same metric contributions as the backend's averageOperatorScore. */
export function operatorCallScore(
    metrics: Record<string, unknown> | undefined,
    defaultKeys?: readonly DefaultMetricKey[],
    includeCustomMetrics = false,
): number | null {
    if (!metrics) return null
    const values: number[] = []
    const keys = defaultKeys ?? ALL_DEFAULT_METRICS.map(({ key }) => key)
    for (const key of keys) {
        const value = metrics[key]
        if (typeof value === 'number' && Number.isFinite(value)) {
            values.push(value)
        } else if (defaultKeys) {
            values.push(0)
        }
    }
    const custom = metrics.custom_metrics
    if (includeCustomMetrics && custom && typeof custom === 'object' && !Array.isArray(custom)) {
        for (const value of Object.values(custom)) {
            if (typeof value === 'boolean') values.push(value ? 100 : 0)
            else if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100) {
                values.push(value)
            }
        }
    }
    return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null
}
