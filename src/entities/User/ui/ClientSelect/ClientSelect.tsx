import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { ClientOptions } from '../../model/types/user'
import { useGetAllUsers } from '../../api/usersApi'
import { AutocompleteInputChangeReason } from '@mui/material'

interface ClientSelectProps {
  label?: string
  value?: ClientOptions | null
  clientId?: string
  className?: string
  onChangeClient?: (event: any, newValue: ClientOptions) => void
  onInputChange?: (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => void
  inputValue?: string
}

export const ClientSelect = memo((props: ClientSelectProps) => {
  const {
    className,
    label,
    value = null,
    inputValue,
    clientId,
    onChangeClient,
    onInputChange,
    ...otherProps
  } = props

  const { data } = useGetAllUsers(null)

  const clientItems = data?.map(item => ({
    id: item.id,
    name: String(item.name)
  })) || []

  const selectedUserValue = clientId ? clientItems.find(item => item.id === clientId) : ''

  const onChangeHandler = (event: any, newValue: ClientOptions) => {
    if (newValue) {
      onChangeClient?.(event, newValue)
    } else {
      onChangeClient?.(event, { id: '', name: '' })
    }
  }

  return (
      <Combobox
          label={label}
          autoComplete={true}
          clearOnBlur={false}
          options={clientItems}
          value={value || selectedUserValue || ''}
          onChange={onChangeHandler}
          inputValue={inputValue}
          getOptionKey={option => option.id}
          isOptionEqualToValue={(option, value) => value === undefined || value === '' || option.id === value.id}
          getOptionLabel={(option) => option.id ? option.name : ''}
          onInputChange={onInputChange}
          {...otherProps}
      />
  )
})
