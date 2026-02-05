import { memo } from 'react'
import { Combobox } from '@/shared/ui/redesign-v3/Combobox'
import { Checkbox } from '@mui/material'
import { Tool } from '../../model/types/tools'
import { useToolsAll } from '../../api/toolsApi'

interface ToolsSelectorProps {
  label?: string
  value?: Tool[]
  toolId?: string | null
  className?: string
  onChangeTool?: (event: any, newValue: Tool[]) => void
  userId?: string
}

export const ToolsSelect = memo((props: ToolsSelectorProps) => {
  const {
    className,
    label,
    value,
    onChangeTool,
    userId,
    ...otherProps
  } = props

  const {
    data: tools
  } = useToolsAll(null)

  const onChangeMultipleHandler = (newValue: Tool | Tool[] | null) => {
    const arrayValue = Array.isArray(newValue) ? newValue : []
    onChangeTool?.(null as any, arrayValue)
  }

  return (
    <Combobox
      multiple
      label={label}
      options={(tools || []).filter(t => t.id && t.name) as any[]}
      value={(value || []).filter(v => v.id && v.name) as any[]}
      onChange={onChangeMultipleHandler}
      className={className}
      renderOption={(option, selected) => (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Checkbox
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {String(option.name)}
        </div>
      )}
      {...otherProps}
    />
  )
})
