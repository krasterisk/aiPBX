import { memo, useMemo } from 'react'
import { Combobox } from '@/shared/ui/redesign-v3/Combobox'
import { useTranslation } from 'react-i18next'
import { UserRolesValues } from '../../model/consts/consts'

interface RoleSelectProps {
  className?: string
  value?: UserRolesValues
  onChange?: (event: any, value: UserRolesValues) => void
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

  const roleItems = useMemo(() => [
    {
      id: UserRolesValues.USER,
      name: t('Клиент')
    },
    {
      id: UserRolesValues.ADMIN,
      name: t('Администратор')
    }
  ], [t])

  const onChangeHandler = (newValue: typeof roleItems[number] | typeof roleItems | null) => {
    if (newValue && !Array.isArray(newValue)) {
      onChange?.(null as any, newValue.id)
    }
  }

  const selectedValue = useMemo(() =>
    roleItems.find(item => item.id === value) || null,
    [roleItems, value]
  )

  return (
    <Combobox
      label={label}
      options={roleItems}
      value={selectedValue}
      onChange={onChangeHandler}
      {...otherProps}
    />
  )
})
