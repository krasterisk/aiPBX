import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Check } from '@/shared/ui/mui/Check'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { AssistantOptions } from '../../model/types/assistants'
import { useAssistantsAll } from '../../api/assistantsApi'

interface BaseAssistantSelectProps {
  label?: string
  className?: string
  userId?: string
  error?: boolean
  helperText?: string
  fullWidth?: boolean
}

interface SingleAssistantSelectProps extends BaseAssistantSelectProps {
  multiple?: false
  value?: AssistantOptions | null
  onChangeAssistant?: (event: any, newValue: AssistantOptions | null) => void
}

interface MultipleAssistantSelectProps extends BaseAssistantSelectProps {
  multiple: true
  value?: AssistantOptions[]
  onChangeAssistant?: (event: any, newValue: AssistantOptions[]) => void
}

export type AssistantSelectProps = SingleAssistantSelectProps | MultipleAssistantSelectProps

export const AssistantSelect = memo((props: AssistantSelectProps) => {
  const {
    className,
    label,
    value,
    onChangeAssistant,
    userId,
    multiple,
    error,
    helperText,
    ...otherProps
  } = props

  const {
    data: assistants
  } = useAssistantsAll(
    { userId }
  )

  const onChangeHandler = (event: any, newValue: any) => {
    if (multiple) {
      (onChangeAssistant as MultipleAssistantSelectProps['onChangeAssistant'])?.(event, newValue)
    } else {
      (onChangeAssistant as SingleAssistantSelectProps['onChangeAssistant'])?.(event, newValue)
    }
  }

  return (
    <Combobox
      id={'assistantSelectBox'}
      multiple={multiple}
      label={label}
      options={assistants || []}
      value={value ?? (multiple ? [] : null)}
      isOptionEqualToValue={(option, value) => value?.id !== undefined && String(option.id) === String(value.id)}
      onChange={onChangeHandler}
      getOptionLabel={(option) => option.name}
      disableCloseOnSelect={multiple}
      renderInput={(params) => (
        <Textarea
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          inputProps={{
            ...params.inputProps,
            readOnly: true
          }}
        />
      )}
      renderOption={multiple ? (props, option, { selected }) => {
        const { ...otherProps } = props
        return (
          <li {...otherProps}>
            <Check
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {String(option.name)}
          </li>
        )
      } : undefined}
      {...otherProps}
    />
  )
})
