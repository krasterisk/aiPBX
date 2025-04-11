import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './ToolMenu.module.scss'
import { useTranslation } from 'react-i18next'
import React, { memo, useCallback } from 'react'
import { Dropdown } from '@/shared/ui/redesigned/Popups'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useDeleteTool } from '../../api/toolsApi'
import { getRouteToolsEdit } from '@/shared/const/router'

interface ToolMenuProps {
  className?: string
  id: string
}

export const ToolMenu = memo((props: ToolMenuProps) => {
  const {
    className,
    id
  } = props
  const { t } = useTranslation('tools')

  const [toolDeleteMutation] = useDeleteTool()

  const handlerDelete = useCallback(() => {
    if (id) {
      toolDeleteMutation(id).unwrap()
    }
  }, [toolDeleteMutation, id])

  const items = [
    {
      content: t('Изменить'),
      href: getRouteToolsEdit(id)
    },
    {
      content: t('Удалить'),
      onClick: handlerDelete
    }
  ]

  return (
      <Dropdown
          className={classNames(cls.ToolMenu, {}, [className])}
          direction={'bottom-left'}
          items={items}
          trigger={<MoreVertIcon className={cls.trigger}/>}
      />

  )
})
