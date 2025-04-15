import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Checkbox } from '@mui/material'
import { Tool } from '../../model/types/tools'

interface CasksSelectorProps {
  label?: string
  value?: Tool[]
  toolId?: string | null
  className?: string
  tools?: Tool[]
  onChangeCask?: (event: any, newValue: Tool[]) => void
  userId?: string
}

export const ToolsSelect = memo((props: CasksSelectorProps) => {
  const {
    className,
    label,
    value,
    onChangeCask,
    userId,
    tools,
    ...otherProps
  } = props

  const onChangeMultipleHandler = (event: any, newValue: Tool[]) => {
    onChangeCask?.(event, newValue)
  }

  return (
      <Combobox
          id={'toolsSelectBox'}
          multiple
          label={label}
          autoComplete
          groupBy={(option) => option.group || ''}
          options={tools || []}
          disableCloseOnSelect
          value={value}
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
