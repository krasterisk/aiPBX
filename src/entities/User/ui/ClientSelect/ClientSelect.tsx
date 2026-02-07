import { useTranslation } from 'react-i18next'
import { memo, useCallback, ReactNode } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { useGetAllUsers } from '../../api/usersApi'
import { Users } from 'lucide-react'
import { TextField } from '@mui/material'

interface ClientSelectProps {
  label?: string
  clientId?: string
  className?: string
  fullWidth?: boolean
  onChangeClient?: (clientId: string) => void
  size?: 'small' | 'medium'
  error?: string
  placeholder?: string
  addonLeft?: ReactNode
  showIcon?: boolean
}

interface ClientOption {
  id: string
  name: string
}

export const ClientSelect = memo((props: ClientSelectProps) => {
  const { t } = useTranslation('users')
  const {
    className,
    label,
    clientId,
    onChangeClient,
    fullWidth = true,
    size = 'medium',
    error,
    placeholder,
    addonLeft,
    showIcon = true
  } = props

  const { data, isLoading } = useGetAllUsers(null)

  const clientItems: ClientOption[] = data?.map(item => ({
    id: String(item.id),
    name: String(item.name)
  })) || []

  const selectedClient = clientId
    ? clientItems.find(item => item.id === clientId) || null
    : null

  const handleChange = useCallback((event: any, value: ClientOption | null) => {
    if (!value) {
      onChangeClient?.('')
    } else {
      onChangeClient?.(value.id)
    }
  }, [onChangeClient])

  // Определяем иконку слева
  const leftAddon = addonLeft || (showIcon ? <Users size={18} style={{ marginRight: 8 }} /> : undefined)
  const placeholderText = placeholder || (t('Все клиенты') as string)

  return (
    <Combobox
      className={className}
      label={label}
      size={size}
      options={clientItems}
      value={selectedClient}
      onChange={handleChange}
      fullWidth={fullWidth}
      disabled={isLoading}
      noOptionsText={t('Клиенты не найдены') ?? ''}
      getOptionLabel={(option: ClientOption) => option.name}
      isOptionEqualToValue={(option: ClientOption, value: ClientOption) => option.id === value.id}
      renderInput={(params: any) => (
        <TextField
          {...params}
          label={label}
          placeholder={isLoading ? (t('Загрузка...') as string) : placeholderText}
          error={!!error}
          helperText={error}
          size={size}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                {leftAddon}
                {params.InputProps.startAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
})
