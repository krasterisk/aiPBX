import type { DisplayMoneyInput } from '@/shared/lib/functions/formatDisplayMoney'
import type { Report } from '../model/types/report'

/** Prefer CDR FX fields; fall back to linked billingRecords (operator analytics, legacy rows). */
export function reportDisplayMoneyInput (
    report: Pick<Report, 'cost' | 'amountCurrency' | 'costCurrency' | 'billingRecords'>,
): DisplayMoneyInput {
    const cdrAmount = report.amountCurrency != null ? Number(report.amountCurrency) : NaN
    if (Number.isFinite(cdrAmount) && cdrAmount > 0) {
        return {
            costUsd: report.cost,
            amountCurrency: cdrAmount,
            costCurrency: report.costCurrency,
        }
    }

    const records = report.billingRecords
    if (records?.length) {
        let amountCurrency = 0
        let totalUsd = 0
        let currency: string | null = report.costCurrency ?? null
        for (const br of records) {
            amountCurrency += Number(br.amountCurrency) || 0
            totalUsd += Number(br.totalCost) || 0
            if (!currency && br.currency) {
                currency = br.currency
            }
        }
        if (amountCurrency > 0) {
            return {
                costUsd: totalUsd || report.cost,
                amountCurrency,
                costCurrency: currency,
            }
        }
    }

    return {
        costUsd: report.cost,
        amountCurrency: report.amountCurrency,
        costCurrency: report.costCurrency,
    }
}
