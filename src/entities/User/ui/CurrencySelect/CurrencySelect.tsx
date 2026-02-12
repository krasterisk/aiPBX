import { memo, useMemo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
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
    { id: UserCurrencyValues.RUB, name: 'RUB' },
    { id: UserCurrencyValues.USD, name: 'USD' },
    { id: UserCurrencyValues.EUR, name: 'EUR' },
    { id: UserCurrencyValues.CNY, name: 'CNY' }
  ], [t])

  const selectedValue = useMemo(
    () => currencyItems.find(item => item.id === value) || null,
    [value, currencyItems]
  )

  const onChangeHandler = (event: any, newValue: typeof currencyItems[number] | null) => {
    if (newValue && !Array.isArray(newValue)) {
      onChange?.(event, newValue.id)
    }
  }

  return (
    <Combobox
      label={label}
      options={currencyItems}
      value={selectedValue}
      onChange={onChangeHandler}
      getOptionLabel={(option: any) => option.name}
      {...otherProps}
    />
  )
})
