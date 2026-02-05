import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { AutocompleteInputChangeReason } from '@mui/material'
import { useGetAllModels } from '../../api/aiModelApi'

interface ModelSelectProps {
  label?: string
  value?: string
  className?: string
  onChangeValue?: (event: any, newValue: string) => void
  onInputChange?: (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => void
  inputValue?: string
  fullWidth?: boolean
}

export const ModelSelect = memo((props: ModelSelectProps) => {
  const {
    className,
    label,
    value,
    inputValue,
    onChangeValue,
    onInputChange,
    ...otherProps
  } = props

  const { data } = useGetAllModels(null)

  const modelItems = data?.map(item => ({
    name: String(item.name),
    id: item.id
  })) || []

  const selectedValue = modelItems.find(item => item.name === value) || null

  const onChangeHandler = (event: any, newValue: typeof modelItems[number] | null) => {
    if (newValue) {
      onChangeValue?.(event, newValue.name || '')
    } else {
      onChangeValue?.(event, '')
    }
  }

  return (
    <Combobox
      label={label}
      options={modelItems}
      value={selectedValue}
      onChange={onChangeHandler}
      className={className}
      getOptionLabel={(option: { name: string }) => option.name}
      isOptionEqualToValue={(option: { name: string }, value: { name: string }) => option.name === value.name}
      {...otherProps}
    />
  )
})
