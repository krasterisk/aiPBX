import type { TagStat } from '@/entities/Report'

export type DistributionChart = 'sentiment' | 'success'
export type DistributionSegment = 'positive' | 'neutral' | 'negative' | 'success' | 'fail'

export type PanelEntry =
    | { kind: 'operator', operatorId?: string, operatorAccountId?: string, operatorName: string }
    | { kind: 'operatorMetric', operatorId?: string, operatorAccountId?: string, operatorName?: string, metricId: string, metricLabel?: string }
    | { kind: 'tag', stat: TagStat }
    | { kind: 'topicCalls', operatorId?: string, operatorAccountId?: string, tagId: string | null, operatorName?: string | null, label: string, callsCount: number }
    | {
        kind: 'distribution'
        chart: DistributionChart
        segment: DistributionSegment
        label: string
    }
    | { kind: 'call', channelId: string, fromLabel: string }

export type TranslateFn = (key: string, options?: Record<string, string>) => string

export function pushPanelEntry(stack: PanelEntry[], entry: PanelEntry): PanelEntry[] {
    return [...stack, entry]
}

export function popPanelEntry(stack: PanelEntry[]): PanelEntry[] {
    if (stack.length === 0) {
        return stack
    }
    return stack.slice(0, -1)
}

export function clearPanelStack(): PanelEntry[] {
    return []
}

export function getCurrentPanelEntry(stack: PanelEntry[]): PanelEntry | undefined {
    return stack[stack.length - 1]
}

export function resolvePanelTitle(entry: PanelEntry | undefined, t: TranslateFn): string {
    if (!entry) {
        return ''
    }

    switch (entry.kind) {
        case 'operator':
            return entry.operatorName === 'Unknown Operator' ? String(t('Без оператора')) : entry.operatorName
        case 'operatorMetric':
            return entry.metricLabel ?? entry.metricId
        case 'tag':
            return entry.stat.name
        case 'topicCalls':
            return entry.label
        case 'distribution':
            return entry.label
        case 'call':
            return entry.fromLabel
        default: {
            const _exhaustive: never = entry
            return String(_exhaustive)
        }
    }
}

export function resolveBackLabel(
    previousEntry: PanelEntry | undefined,
    t: TranslateFn,
): string | undefined {
    if (!previousEntry) {
        return undefined
    }

    const context = entryContextLabel(previousEntry, t)
    return String(t('Назад к {{context}}', { context }))
}

function entryContextLabel(entry: PanelEntry, t: TranslateFn): string {
    switch (entry.kind) {
        case 'operator':
            return entry.operatorName === 'Unknown Operator' ? String(t('Без оператора')) : entry.operatorName
        case 'operatorMetric':
            return entry.metricLabel ?? entry.metricId
        case 'tag':
            return entry.stat.name
        case 'topicCalls':
            return entry.label
        case 'distribution':
            return entry.label
        case 'call':
            return entry.fromLabel
        default: {
            const _exhaustive: never = entry
            return String(_exhaustive)
        }
    }
}
