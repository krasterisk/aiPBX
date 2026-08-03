import {
    clearPanelStack,
    getCurrentPanelEntry,
    popPanelEntry,
    pushPanelEntry,
    resolveBackLabel,
    resolvePanelTitle,
    type PanelEntry,
} from './panelStack'

const t = (key: string, options?: Record<string, string>) => {
    if (options?.context) {
        return `${key}:${options.context}`
    }
    return key
}

describe('panelStack', () => {
    const operatorEntry: PanelEntry = { kind: 'operator', operatorName: 'Anna' }
    const metricEntry: PanelEntry = {
        kind: 'operatorMetric',
        operatorName: 'Anna',
        metricId: 'greeting_quality',
        metricLabel: 'Greeting quality',
    }
    const callEntry: PanelEntry = {
        kind: 'call',
        channelId: 'cdr-42',
        fromLabel: 'Greeting quality',
    }

    it('starts empty with no current entry', () => {
        const stack: PanelEntry[] = []

        expect(getCurrentPanelEntry(stack)).toBeUndefined()
    })

    it('returns depth one with the operator entry after push', () => {
        const stack = pushPanelEntry([], operatorEntry)

        expect(stack).toHaveLength(1)
        expect(getCurrentPanelEntry(stack)).toEqual(operatorEntry)
    })

    it('returns depth three with the call entry after operator, metric, and call pushes', () => {
        let stack: PanelEntry[] = []
        stack = pushPanelEntry(stack, operatorEntry)
        stack = pushPanelEntry(stack, metricEntry)
        stack = pushPanelEntry(stack, callEntry)

        expect(stack).toHaveLength(3)
        expect(getCurrentPanelEntry(stack)).toEqual(callEntry)
    })

    it('pops back to the operator metric entry and preserves metric identity', () => {
        let stack: PanelEntry[] = []
        stack = pushPanelEntry(stack, operatorEntry)
        stack = pushPanelEntry(stack, metricEntry)
        stack = pushPanelEntry(stack, callEntry)

        stack = popPanelEntry(stack)

        expect(stack).toHaveLength(2)
        expect(getCurrentPanelEntry(stack)).toEqual(metricEntry)
        expect(getCurrentPanelEntry(stack)).toMatchObject({
            metricId: 'greeting_quality',
            metricLabel: 'Greeting quality',
        })
    })

    it('returns an empty stack when popping at depth one', () => {
        const stack = pushPanelEntry([], operatorEntry)

        const next = popPanelEntry(stack)

        expect(next).toEqual([])
        expect(getCurrentPanelEntry(next)).toBeUndefined()
    })

    it('leaves an empty stack unchanged when popping again', () => {
        const stack: PanelEntry[] = []

        const next = popPanelEntry(stack)

        expect(next).toBe(stack)
        expect(next).toEqual([])
    })

    it('clears the stack from any depth', () => {
        let stack: PanelEntry[] = []
        stack = pushPanelEntry(stack, operatorEntry)
        stack = pushPanelEntry(stack, metricEntry)
        stack = pushPanelEntry(stack, callEntry)

        const cleared = clearPanelStack()

        expect(cleared).toEqual([])
        expect(stack).toHaveLength(3)
    })

    it('never mutates the input array in push, pop, or clear helpers', () => {
        const initial: PanelEntry[] = [operatorEntry]
        const initialCopy = [...initial]

        pushPanelEntry(initial, metricEntry)
        popPanelEntry(initial)
        clearPanelStack()

        expect(initial).toEqual(initialCopy)
    })

    it('resolves operator and tag titles', () => {
        expect(resolvePanelTitle(operatorEntry, t)).toBe('Anna')
        expect(resolvePanelTitle({
            kind: 'tag',
            stat: {
                tagId: 'refunds',
                name: 'Refunds',
                callsCount: 1,
                averageScore: 80,
                successRate: 1,
                sentiment: { positive: 1, neutral: 0, negative: 0 },
                shareOfPeriodCalls: 10,
                deltaVsPeriodAverage: 0,
            },
        }, t)).toBe('Refunds')
    })

    it('resolves distribution panel titles and back labels', () => {
        const distributionEntry: PanelEntry = {
            kind: 'distribution',
            chart: 'sentiment',
            segment: 'negative',
            label: 'Негативное настроение',
        }

        expect(resolvePanelTitle(distributionEntry, t)).toBe('Негативное настроение')
        expect(resolveBackLabel(distributionEntry, t)).toBe('Назад к {{context}}:Негативное настроение')
    })

    it('resolves the back label from the entry directly below the current one', () => {
        const stack = [operatorEntry, metricEntry, callEntry]
        const previous = stack[stack.length - 2]

        expect(resolveBackLabel(previous, t)).toBe('Назад к {{context}}:Greeting quality')
    })
})
