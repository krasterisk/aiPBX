/** RUB (or tenant currency) per 1 USD — same semantics as billing `fxRateUsdToCurrency`. */
export function formatFxRateUsdToCurrency (
    rate: number | string | null | undefined,
): string {
    const n = rate != null ? Number(rate) : NaN
    if (!Number.isFinite(n) || n <= 0) {
        return '—'
    }
    return `1 USD = ${n.toFixed(2)} ₽`
}

export function pickFxRateUsdToCurrency (row: {
    fxRateUsdToCurrency?: number | string | null
    fxRateRubUsd?: number | string | null
}): number | null {
    const primary = row.fxRateUsdToCurrency != null ? Number(row.fxRateUsdToCurrency) : NaN
    if (Number.isFinite(primary) && primary > 0) {
        return primary
    }
    const legacy = row.fxRateRubUsd != null ? Number(row.fxRateRubUsd) : NaN
    if (Number.isFinite(legacy) && legacy > 0) {
        return legacy
    }
    return null
}
