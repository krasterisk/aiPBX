import { memo, useMemo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { useTranslation } from 'react-i18next'
import { UserCurrencyValues } from '../../model/consts/consts'
import { UserCurrency } from '../../model/types/user'

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

  const currencyItems: UserCurrency[] = useMemo(() => [
    { value: UserCurrencyValues.RUB, descriptions: String(t('Рубль')) },
    { value: UserCurrencyValues.USD, descriptions: String(t('Доллар')) },
    { value: UserCurrencyValues.EUR, descriptions: String(t('Евро')) },
    { value: UserCurrencyValues.CNY, descriptions: String(t('Китайский юань')) }
  ], [t])

  const selectedValue = useMemo(
    () => currencyItems.find(item => item.value === value) || null,
    [value, currencyItems]
  )

  const onChangeHandler = (event: any, newValue: UserCurrency | null) => {
    if (newValue?.value) {
      onChange?.(event, newValue.value)
    }
  }

  return (
      <Combobox
          label={label}
          autoComplete
          options={currencyItems}
          value={selectedValue}
          onChange={onChangeHandler}
          getOptionKey={(option) => option.value}
          isOptionEqualToValue={(option, val) => option.value === val?.value}
          getOptionLabel={(option) => option.descriptions || ''}
          {...otherProps}
      />
  )
})
