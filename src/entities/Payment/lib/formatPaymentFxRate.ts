import type { Payment } from '../model/types/payment'
import { formatFxRateUsdToCurrency, pickFxRateUsdToCurrency } from '@/shared/lib/functions/formatFxRateDisplay'

export function formatPaymentFxRate (payment: Payment): string {
    return formatFxRateUsdToCurrency(pickFxRateUsdToCurrency(payment))
}
