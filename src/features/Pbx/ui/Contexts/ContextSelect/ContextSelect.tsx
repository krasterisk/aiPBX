import { ListBox } from '@/shared/ui/redesigned/Popups'
import { memo, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetContexts } from '../../../../../pages/pbx/ContextsPage/api/contextsApi'
import { useSelector } from 'react-redux'
import { getUserAuthData } from '@/entities/User'

interface ContextsSelectProps {
  className?: string
  value?: string
  onChange?: (value: string) => void
  readonly?: boolean
  label?: string
  multiple?: boolean
  defaultValue?: string
}

export const ContextSelect = memo((props: ContextsSelectProps) => {
  const {
    className,
    value,
    onChange,
    readonly,
    label,
    multiple,
    defaultValue
  } = props

  const { t } = useTranslation()
  const userData = useSelector(getUserAuthData)
  const vpbx_user_id = userData?.vpbx_user_id || '0'

  const { data } = useGetContexts({ vpbx_user_id })

  const contextItems = data?.map(item => ({
    value: item.name,
    content: item.name
  }))

  // todo надо будет сделать при редактировании - исключить сам себя из списка контекстов
  // .filter(item => item.value !== value)

  // const initValue = !value &&
  //     !defaultValue &&
  // contextItems &&
  // contextItems?.length > 0
  //   ? contextItems[0].value
  //   : defaultValue || value

  useEffect(() => {
    if (!value && !defaultValue && contextItems && contextItems.length > 0) {
      onChange?.(contextItems[0].value)
    }
  }, [contextItems, defaultValue, onChange, value])

  const onChangeHandler = useCallback((value: string) => {
    onChange?.(value)
  }, [onChange])

  const contextProps = {
    className,
    items: contextItems,
    value: value || defaultValue,
    defaultValue,
    label: String(t(label || 'Контекст')),
    onChange: onChangeHandler,
    readonly,
    multiple,
    direction: 'bottom-right' as const
  }

  return (
        <ListBox {...contextProps}/>
  )
})
