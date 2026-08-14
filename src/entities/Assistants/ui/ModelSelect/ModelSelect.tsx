import { memo, ReactNode, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { AutocompleteInputChangeReason } from '@mui/material'
import { isUserAdmin } from '@/entities/User'
import { useGetAllModels } from '../../api/aiModelApi'
import { filterSelectableAssistantModels } from '../../model/lib/filterSelectableAssistantModels'

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
  required?: boolean
  error?: boolean
  helperText?: ReactNode
  'data-testid'?: string
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

  const isAdmin = useSelector(isUserAdmin)
  const { data } = useGetAllModels(null)

  const modelItems = useMemo(() => (
    filterSelectableAssistantModels(data, isAdmin, value).map(item => ({
      name: String(item.name),
      publishName: item.publishName || item.name,
      realtimeVendor: item.realtimeVendor || undefined,
      id: item.id,
    }))
  ), [data, isAdmin, value])

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
      getOptionLabel={(option: { name: string, publishName: string, realtimeVendor?: string }) => {
        const vendor = option.realtimeVendor ? ` [${option.realtimeVendor}]` : ''
        return `${option.publishName}${vendor}`
      }}
      isOptionEqualToValue={(option: { name: string }, value: { name: string }) => option.name === value.name}
      {...otherProps}
    />
  )
})
