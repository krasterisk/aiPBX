import { UserCurrencyValues } from "@/entities/User/model/consts/consts"
import { currencySymbols } from "@/entities/User/model/consts/consts"

/**
 * Универсальная функция для форматирования валюты
 * @param value - сумма
 * @param currency - код валюты (USD, RUB, EUR, CNY)
 * @param decimalPlaces - количество знаков после запятой
 */
export const formatCurrency = (
    value: number | undefined | null,
    currency: string | UserCurrencyValues = UserCurrencyValues.USD,
    decimalPlaces: number = 2
) => {
    if (value === undefined || value === null) {
        return ''
    }

    const symbol = currencySymbols[currency] || currencySymbols[UserCurrencyValues.USD]
    const formattedValue = parseFloat(value.toFixed(decimalPlaces))

    // В зависимости от валюты можно менять положение символа, 
    // но в текущем проекте символ всегда идет перед числом (судя по коду balance).
    return `${symbol}${formattedValue}`
}
