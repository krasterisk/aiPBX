import { formatCurrency } from '@/shared/lib/functions/formatCurrency'
import { currencySymbols, UserCurrencyValues } from '../model/consts/consts'

export function formatBalanceAmount (value: number, currency: UserCurrencyValues): string {
  const amount = parseFloat(value.toFixed(2))
  if (currency === UserCurrencyValues.RUB) {
    return `${amount} ${currencySymbols.RUB}`
  }
  return formatCurrency(amount, currency, 2)
}
