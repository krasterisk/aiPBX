import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { useTranslation } from 'react-i18next'
import { UserRolesValues } from '../../model/consts/consts'
import { UserRoles } from '../../model/types/user'

interface RoleSelectProps {
  className?: string
  value?: UserRoles
  onChange?: (event: any, value: UserRoles) => void
  label?: string
}

export const RoleSelect = memo((props: RoleSelectProps) => {
  const {
    value,
    onChange,
    label,
    ...otherProps
  } = props

  const { t } = useTranslation('profile')

  const roleItems = [
    {
      value: UserRolesValues.USER,
      descriptions: t('Клиент')
    },
    {
      value: UserRolesValues.ADMIN,
      descriptions: t('Администратор')
    }
  ]

  const onChangeHandler = (event: any, newValue: UserRoles | null) => {
    if (newValue) {
      onChange?.(event, newValue)
    }
  }

  return (
    <Combobox
      label={label}
      autoComplete={true}
      options={roleItems}
      value={value ?? null}
      onChange={onChangeHandler}
      getOptionKey={option => option?.value}
      isOptionEqualToValue={(option, value) => option.value === value?.value}
      getOptionLabel={(option) => {
        const found = roleItems.find(item => item.value === option?.value)
        return found ? found.descriptions : (option?.descriptions || '')
      }}
      {...otherProps}
    />
  )
})
