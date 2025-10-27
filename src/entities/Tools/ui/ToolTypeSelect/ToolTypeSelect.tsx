import { memo } from 'react'
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

  const toolsData = [
    {
      value: ToolTypesValues.FUNCTION,
      descriptions: t('Функция')
    },
    {
      value: ToolTypesValues.MCP,
      descriptions: t('MCP сервер')
    }
  ]

  const currentValue = toolsData.find(option => option.value === value) || null

  const onChangeHandler = (event: any, newValue: ToolType) => {
    if (newValue) {
      onChangeToolType?.(event, newValue)
    }
  }

  return (
        <Combobox
            label={label}
            autoComplete={true}
            options={toolsData}
            disableClearable
            value={currentValue}
            onChange={onChangeHandler}
            getOptionKey={option => option.value}
            isOptionEqualToValue={(option, value) => value === undefined || value === '' || option.value === value.value}
            getOptionLabel={(option) => option.value ? option.descriptions : ''}
            {...otherProps}
        />
  )
})
