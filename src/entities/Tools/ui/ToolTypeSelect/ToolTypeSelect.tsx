import { memo, useMemo } from 'react'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { ToolType } from '../../model/types/tools'
import { ToolTypesValues } from '../../model/consts/consts'
import { useTranslation } from 'react-i18next'

interface ToolTypeSelectorProps {
  label?: string
  value?: string
  className?: string
  onChangeToolType?: (event: any, newValue: ToolType) => void
}

export const ToolTypeSelect = memo((props: ToolTypeSelectorProps) => {
  const {
    className,
    label,
    value,
    onChangeToolType,
    ...otherProps
  } = props

  const { t } = useTranslation('tools')

  const toolsData = useMemo(() => [
    {
      id: ToolTypesValues.FUNCTION,
      name: t('Вызов функции'),
      value: ToolTypesValues.FUNCTION,
      descriptions: t('Вызов функции')
    },
    {
      id: ToolTypesValues.MCP,
      name: t('MCP сервер'),
      value: ToolTypesValues.MCP,
      descriptions: t('MCP сервер')
    }
  ], [t])

  const currentValue = useMemo(
    () => toolsData.find(option => option.value === value) || null,
    [toolsData, value]
  )

  const onChangeHandler = (event: any, newValue: typeof toolsData[number] | null) => {
    if (newValue && !Array.isArray(newValue)) {
      onChangeToolType?.(event, { value: newValue.value, descriptions: newValue.descriptions })
    } else {
      onChangeToolType?.(event, { value: '' as any, descriptions: '' })
    }
  }

  return (
    <Combobox
      label={label}
      options={toolsData}
      className={className}
      value={currentValue}
      onChange={onChangeHandler}
      getOptionLabel={(option: any) => option.name}
      {...otherProps}
    />
  )
})
