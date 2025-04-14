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
  onChangeClient?: (event: any, newValue: ClientOptions | null) => void
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
    onChangeClient,
    onInputChange,
    ...otherProps
  } = props

  const { data } = useGetAllUsers(null)

  const clientItems = data?.map(item => ({
    id: item.id,
    name: String(item.name)
  })) || []

  const selectedUserValue = value
    ? clientItems.find(item => item.id === value.id) || null
    : null

  const onChangeHandler = (event: any, newValue: ClientOptions | null) => {
    onChangeClient?.(event, newValue)
  }

  return (
      <Combobox
          label={label}
          autoComplete={true}
          clearOnBlur={false}
          options={clientItems}
          value={selectedUserValue}
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
