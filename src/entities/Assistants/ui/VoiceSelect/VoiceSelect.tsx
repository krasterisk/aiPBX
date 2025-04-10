import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { AutocompleteInputChangeReason } from '@mui/material'

interface Voice {
  id: string
  name: string
}

interface VoiceSelectProps {
  label?: string
  value?: Voice | string
  voiceId?: string
  className?: string
  onChangeClient?: (event: any, newValue: Voice) => void
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
    voiceId,
    inputValue,
    onChangeClient,
    onInputChange,
    ...otherProps
  } = props

  const topics = [
    {
      id: '1',
      name: 'Alloy'
    },
    {
      id: '2',
      name: 'Ash'
    },
    {
      id: '3',
      name: 'Ballad'
    },
    {
      id: '4',
      name: 'Coral'
    },
    {
      id: '5',
      name: 'Echo'
    },
    {
      id: '6',
      name: 'Sage'
    },
    {
      id: '7',
      name: 'Shimmer'
    },
    {
      id: '8',
      name: 'Verse'
    }
  ]

  const selectedValue = voiceId ? topics.find(item => item.id === voiceId) : ''

  const onChangeHandler = (event: any, newValue: Voice) => {
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
          options={topics}
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
