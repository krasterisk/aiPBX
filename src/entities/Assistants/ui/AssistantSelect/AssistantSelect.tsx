import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Checkbox } from '@mui/material'
import { AssistantOptions } from '../../model/types/assistants'
import { useAssistantsAll } from '../../api/assistantsApi'

interface AssistantSelectProps {
  label?: string
  value?: AssistantOptions[]
  assistantId?: string[]
  className?: string
  onChangeAssistant?: (event: any, newValue: AssistantOptions[]) => void
  userId?: string
}

export const AssistantSelect = memo((props: AssistantSelectProps) => {
  const {
    className,
    label,
    value,
    onChangeAssistant,
    userId,
    assistantId,
    ...otherProps
  } = props

  const {
    data: assistants
  } = useAssistantsAll(
    { userId }
  )

  const onChangeMultipleHandler = (event: any, newValue: AssistantOptions[]) => {
    onChangeAssistant?.(event, newValue)
  }

  return (
      <Combobox
          id={'assistantSelectBox'}
          multiple
          label={label}
          autoComplete
          groupBy={(option) => option.group || ''}
          options={assistants || []}
          disableCloseOnSelect
          value={value}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(props, option, { selected, inputValue, index }) => {
            const { ...otherProps } = props
            return (
                <li {...otherProps}>
                  <Checkbox
                      // icon={icon}
                      // checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                  />
                  {String(option.name)}
                </li>
            )
          }}
          onChange={onChangeMultipleHandler}
          getOptionLabel={(option) => option.name}
          {...otherProps}
      />
  )
})
