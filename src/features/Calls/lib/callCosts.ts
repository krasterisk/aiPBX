import type { Report } from '@/entities/Report'
export interface CallCostGroup { currency: string, total: number, items: Record<string, number>, freeRuns: number }
/** Group charged snapshots by currency; free admin runs never inflate customer costs. */
export function callCosts(report: Report): CallCostGroup[] {
    const groups = new Map<string, CallCostGroup>()
    for (const row of report.billingRecords ?? []) {
        const currency = row.amountCurrency != null ? row.currency || 'USD' : 'USD'
        const group = groups.get(currency) ?? { currency, total: 0, items: {}, freeRuns: 0 }
        groups.set(currency, group)
        if (row.type === 'analytic_regen_free') { group.freeRuns++; continue }
        const total = Number(row.amountCurrency ?? row.totalCost)
        if (!Number.isFinite(total)) continue
        group.total += total
        const rate = currency === 'USD' ? 1 : row.fxRateUsdToCurrency != null ? Number(row.fxRateUsdToCurrency) : Number(row.totalCost) > 0 ? total / Number(row.totalCost) : 0
        if (row.type === 'realtime') group.items.realtime = (group.items.realtime ?? 0) + total
        else {
            const stt = Number(row.sttCost || 0) * rate
            const text = Number(row.textCost || 0) * rate
            if (stt || ['external-api', 'external-front'].includes(String(report.source))) group.items.transcription = (group.items.transcription ?? 0) + stt
            if (text) group.items.analytics = (group.items.analytics ?? 0) + text
            const remaining = total - stt - text
            if (Math.abs(remaining) > 0.00001) { const key = row.type.startsWith('analytic') ? 'analytics' : 'other'; group.items[key] = (group.items[key] ?? 0) + remaining }
        }
    }
    const onlyFreeRuns = Boolean(report.billingRecords?.length) && report.billingRecords!.every(row => row.type === 'analytic_regen_free')
    if ((!groups.size || onlyFreeRuns) && (report.cost != null || report.amountCurrency != null)) {
        const currency = report.amountCurrency != null ? report.costCurrency || 'USD' : 'USD'
        const freeRuns = Array.from(groups.values()).reduce((sum, group) => sum + group.freeRuns, 0)
        groups.clear()
        groups.set(currency, { currency, total: Number(report.amountCurrency ?? report.cost), items: {}, freeRuns })
    }
    return Array.from(groups.values())
}
