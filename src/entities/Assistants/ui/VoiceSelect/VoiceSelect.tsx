import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { AutocompleteInputChangeReason } from '@mui/material'

interface VoiceSelectProps {
  label?: string
  value?: string
  className?: string
  model?: string
  onChangeValue?: (event: any, newValue: string) => void
  onInputChange?: (
    event: React.SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => void
  inputValue?: string
}

const GPT_VOICES = ['alloy', 'ash', 'ballad', 'cedar', 'coral', 'echo', 'sage', 'shimmer', 'marin', 'verse']

const QWEN_VOICES = [
  'Cherry', 'Serena', 'Ethan', 'Chelsie', 'Momo', 'Vivian', 'Moon', 'Maia', 'Kai', 'Nofish',
  'Bella', 'Jennifer', 'Ryan', 'Katerina', 'Aiden', 'Eldric Sage', 'Mia', 'Mochi', 'Bellona',
  'Vincent', 'Bunny', 'Neil', 'Elias', 'Arthur', 'Nini', 'Ebona', 'Seren', 'Pip', 'Stella',
  'Bodega', 'Sonrisa', 'Alek', 'Dolce', 'Sohee', 'Ono Anna', 'Lenn', 'Emilien', 'Andre',
  'Radio Gol', 'Jada', 'Dylan', 'Li', 'Marcus', 'Roy', 'Peter', 'Sunny', 'Eric', 'Rocky', 'Kiki'
]

export const VoiceSelect = memo((props: VoiceSelectProps) => {
  const {
    className,
    label,
    value,
    inputValue,
    model,
    onChangeValue,
    onInputChange,
    ...otherProps
  } = props

  let topics: string[] = []

  if (model?.startsWith('gpt')) {
    topics = GPT_VOICES
  } else if (model?.startsWith('qwen')) {
    topics = QWEN_VOICES
  } else {
    topics = GPT_VOICES
  }

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
      freeSolo={false}
      {...otherProps}
    />
  )
})
