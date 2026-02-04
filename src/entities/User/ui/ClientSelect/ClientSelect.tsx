import { useTranslation } from 'react-i18next'
import { memo, useCallback, ReactNode } from 'react'
import { Combobox, ComboboxOption } from '@/shared/ui/redesign-v3/Combobox'
import { useGetAllUsers } from '../../api/usersApi'
import { Users } from 'lucide-react'

interface ClientSelectProps {
  label?: string
  clientId?: string
  className?: string
  fullWidth?: boolean
  onChangeClient?: (clientId: string) => void
  size?: 's' | 'm' | 'l'
  error?: string
  placeholder?: string
  addonLeft?: ReactNode
  showIcon?: boolean
}

export const ClientSelect = memo((props: ClientSelectProps) => {
  const { t } = useTranslation('users')
  const {
    className,
    label,
    clientId,
    onChangeClient,
    fullWidth = true,
    size = 'm',
    error,
    placeholder,
    addonLeft,
    showIcon = true
  } = props

  const { data, isLoading } = useGetAllUsers(null)

  const clientItems: ComboboxOption[] = data?.map(item => ({
    id: item.id,
    name: String(item.name)
  })) || []

  const selectedClient = clientId
    ? clientItems.find(item => item.id === clientId) || null
    : null

  const handleChange = useCallback((value: ComboboxOption | ComboboxOption[] | null) => {
    if (!value || Array.isArray(value)) {
      onChangeClient?.('')
    } else {
      onChangeClient?.(value.id)
    }
  }, [onChangeClient])

  // Определяем иконку слева
  const leftAddon = addonLeft || (showIcon ? <Users size={18} /> : undefined)
  const placeholderText = placeholder || (t('Все клиенты') as string)

  return (
    <Combobox
      className={className}
      label={label}
      placeholder={isLoading ? (t('Загрузка...') as string) : placeholderText}
      options={clientItems}
      value={selectedClient}
      onChange={handleChange}
      fullWidth={fullWidth}
      size={size}
      error={error}
      searchable={true}
      clearable={true}
      disabled={isLoading}
      noOptionsText={t('Клиенты не найдены') ?? ''}
      addonLeft={leftAddon}
    />
  )
})
