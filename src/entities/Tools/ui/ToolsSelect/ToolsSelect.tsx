import { memo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Check } from '@/shared/ui/mui/Check'
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

  const onChangeMultipleHandler = (event: any, newValue: Tool | Tool[] | null) => {
    const arrayValue = Array.isArray(newValue) ? newValue : []
    onChangeTool?.(event, arrayValue)
  }

  return (
    <Combobox
      multiple
      label={label}
      options={(tools || []).filter(t => t.id && t.name) as any[]}
      value={(value || []).filter(v => v.id && v.name) as any[]}
      onChange={onChangeMultipleHandler}
      className={className}
      getOptionLabel={(option: any) => option.name || ''}
      renderOption={(props, option: any, { selected }) => (
        <li {...props}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Check
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {String(option.name)}
          </div>
        </li>
      )}
      {...otherProps}
    />
  )
})
