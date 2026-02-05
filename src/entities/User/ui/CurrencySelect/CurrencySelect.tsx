import { memo, useMemo } from 'react'
import { Combobox } from '@/shared/ui/redesign-v3/Combobox'
import { useTranslation } from 'react-i18next'
import { UserCurrencyValues } from '../../model/consts/consts'

interface CurrencySelectProps {
  className?: string
  value?: UserCurrencyValues
  onChange?: (event: any, value: UserCurrencyValues) => void
  label?: string
}

export const CurrencySelect = memo((props: CurrencySelectProps) => {
  const {
    value,
    onChange,
    label,
    ...otherProps
  } = props

  const { t } = useTranslation('profile')

  const currencyItems = useMemo(() => [
    { id: UserCurrencyValues.RUB, name: String(t('Рубль')) },
    { id: UserCurrencyValues.USD, name: String(t('Доллар')) },
    { id: UserCurrencyValues.EUR, name: String(t('Евро')) },
    { id: UserCurrencyValues.CNY, name: String(t('Китайский юань')) }
  ], [t])

  const selectedValue = useMemo(
    () => currencyItems.find(item => item.id === value) || null,
    [value, currencyItems]
  )

  const onChangeHandler = (newValue: typeof currencyItems[number] | typeof currencyItems | null) => {
    if (newValue && !Array.isArray(newValue)) {
      onChange?.(null as any, newValue.id)
    }
  }

  return (
    <Combobox
      label={label}
      options={currencyItems}
      value={selectedValue}
      onChange={onChangeHandler}
      {...otherProps}
    />
  )
})
