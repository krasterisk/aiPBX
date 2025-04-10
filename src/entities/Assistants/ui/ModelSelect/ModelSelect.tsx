import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { AutocompleteInputChangeReason } from '@mui/material'
import { AiModel } from '../../model/aiModel'
import { useGetAllModels } from '../../api/aiModelApi'

interface ModelSelectProps {
  label?: string
  value?: AiModel | string
  modelId?: string
  className?: string
  onChangeClient?: (event: any, newValue: AiModel) => void
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
    modelId,
    inputValue,
    onChangeClient,
    onInputChange,
    ...otherProps
  } = props

  const { data } = useGetAllModels(null)

  const modelItems = data?.map(item => ({
    id: item.id,
    name: String(item.name)
  })) || []

  const selectedValue = modelId ? modelItems.find(item => item.id === modelId) : ''

  const onChangeHandler = (event: any, newValue: AiModel) => {
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
          options={modelItems}
          value={value || selectedValue || ''}
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
