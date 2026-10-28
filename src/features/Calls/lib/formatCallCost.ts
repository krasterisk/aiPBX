import { reportDisplayMoneyInput, type Report } from '@/entities/Report'
import { resolveDisplayMoney } from '@/shared/lib/functions/formatDisplayMoney'

/** Use the existing charged currency snapshot, never a current exchange rate. */
export function formatCallCost(report: Report, locale?: string): string {
    if (report.cost == null && report.amountCurrency == null && !report.billingRecords?.length) return '—'
    const { value, currency } = resolveDisplayMoney(reportDisplayMoneyInput(report))
    return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
}
