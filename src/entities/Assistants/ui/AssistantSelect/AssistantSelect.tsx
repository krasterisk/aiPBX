import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Check } from '@/shared/ui/mui/Check'
import { AssistantOptions } from '../../model/types/assistants'
import { useAssistantsAll } from '../../api/assistantsApi'
import { TextField } from '@mui/material'

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

  const onChangeHandler = (event: any, newValue: AssistantOptions | AssistantOptions[] | null) => {
    if (multiple) {
      const arrayValue = Array.isArray(newValue) ? newValue : [];
      (onChangeAssistant)?.(event, arrayValue)
    } else {
      const singleValue = Array.isArray(newValue) ? null : newValue;
      (onChangeAssistant)?.(event, singleValue)
    }
  }

  return (
    <Combobox
      multiple={multiple}
      label={label}
      options={(assistants || []).filter(a => a.id) as AssistantOptions[]}
      value={value ?? (multiple ? [] : null)}
      onChange={onChangeHandler}
      className={className}
      getOptionLabel={(option: AssistantOptions) => option.name || ''}
      isOptionEqualToValue={(option: AssistantOptions, value: AssistantOptions) => option.id === value.id}
      renderInput={(params: any) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
        />
      )}
      renderOption={multiple
? (props, option, { selected }) => (
        <li {...props}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Check
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {String(option.name)}
          </div>
        </li>
      )
: undefined}
      {...otherProps}
    />
  )
})
