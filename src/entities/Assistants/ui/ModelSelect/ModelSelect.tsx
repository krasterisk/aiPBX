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

  const onChangeHandler = (event: any, newValue: { name: string }) => {
    onChangeValue?.(event, newValue?.name || '')
  }

  return (
      <Combobox
          label={label}
          autoComplete={true}
          clearOnBlur={false}
          options={modelItems}
          value={selectedValue}
          onChange={onChangeHandler}
          inputValue={inputValue}
          getOptionKey={option => option.name}
          isOptionEqualToValue={(option, value) => option.name === value?.name}
          getOptionLabel={option => option.name || ''}
          onInputChange={onInputChange}
          {...otherProps}
      />
  )
})
