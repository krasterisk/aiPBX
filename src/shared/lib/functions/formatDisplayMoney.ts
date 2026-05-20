import { formatCurrency } from './formatCurrency'
import { getTenantCurrencyCode } from '../domain'

const USD = 'USD'
const RUB = 'RUB'
const RUB_SYMBOL = '₽'

export interface DisplayMoneyInput {
    /** Cost in USD (ledger / internal) */
    costUsd?: number | null
    /** Cost in tenant currency at charge time */
    amountCurrency?: number | null
    /** Currency code from API (costCurrency) */
    costCurrency?: string | null
}

/**
 * Picks the amount and currency to show in UI.
 * On RU tenant prefers fixed amountCurrency; otherwise USD cost.
 */
export function resolveDisplayMoney (input: DisplayMoneyInput): {
    value: number
    currency: string
} {
    const tenant = getTenantCurrencyCode()
    const amount = input.amountCurrency != null ? Number(input.amountCurrency) : NaN
    const rowCurrency = (input.costCurrency || '').toUpperCase()

    if (Number.isFinite(amount) && amount > 0) {
        // Prefer FX snapshot from API (works even if tenant detection is wrong)
        if (rowCurrency && rowCurrency !== USD) {
            return { value: amount, currency: rowCurrency }
        }
        if (tenant !== USD) {
            return { value: amount, currency: rowCurrency || tenant }
        }
    }

    const usd = Number(input.costUsd) || 0
    return { value: usd, currency: USD }
}

/** Amount already aggregated in tenant currency from API (e.g. dashboard allCost on RU tenant). */
export function formatTenantMoney (amount: number, decimalPlaces = 2): string {
    const tenant = getTenantCurrencyCode()
    if (!amount) return formatDisplayMoney({ costUsd: 0 }, decimalPlaces)
    if (tenant === USD) {
        return formatDisplayMoney({ costUsd: amount }, decimalPlaces)
    }
    return formatDisplayMoney({
        costUsd: amount,
        amountCurrency: amount,
        costCurrency: tenant,
    }, decimalPlaces)
}

export function formatDisplayMoney (
    input: DisplayMoneyInput,
    decimalPlaces = 2,
): string {
    const { value, currency } = resolveDisplayMoney(input)
    if (!value) return ''
    if (currency === RUB) {
        const amount = parseFloat(value.toFixed(decimalPlaces))
        return `${amount} ${RUB_SYMBOL}`
    }
    return formatCurrency(value, currency, decimalPlaces)
}
