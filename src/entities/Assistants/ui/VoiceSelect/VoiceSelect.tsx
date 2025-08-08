import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { AutocompleteInputChangeReason } from '@mui/material'

interface VoiceSelectProps {
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

export const VoiceSelect = memo((props: VoiceSelectProps) => {
  const {
    className,
    label,
    value,
    inputValue,
    onChangeValue,
    onInputChange,
    ...otherProps
  } = props

  const topics = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'sage', 'shimmer', 'verse']

  const selectedValue = topics.find(item => item === value) ?? null

  const onChangeHandler = (event: any, newValue: string) => {
    onChangeValue?.(event, newValue)
  }

  return (
      <Combobox
          label={label}
          autoComplete={true}
          clearOnBlur={false}
          options={topics}
          value={selectedValue}
          onChange={onChangeHandler}
          inputValue={inputValue}
          onInputChange={onInputChange}
          {...otherProps}
      />
  )
})
