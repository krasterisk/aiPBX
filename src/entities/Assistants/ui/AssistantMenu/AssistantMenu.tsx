import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantMenu.module.scss'
import { useTranslation } from 'react-i18next'
import React, { memo, useCallback } from 'react'
import { Dropdown } from '@/shared/ui/redesigned/Popups'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useDeleteAssistant } from '../../api/assistantsApi'
import { getRouteAssistantEdit } from '@/shared/const/router'

interface UserMenuProps {
  className?: string
  id: string
}

export const AssistantMenu = memo((props: UserMenuProps) => {
  const {
    className,
    id
  } = props
  const { t } = useTranslation('assistants')

  const [assistantDeleteMutation] = useDeleteAssistant()

  const handlerDelete = useCallback(() => {
    if (id) {
      assistantDeleteMutation(id).unwrap()
    }
  }, [assistantDeleteMutation, id])

  const items = [
    {
      content: t('Изменить'),
      href: getRouteAssistantEdit(id)
    },
    {
      content: t('Удалить'),
      onClick: handlerDelete
    }
  ]

  return (
      <Dropdown
          className={classNames(cls.AssistantMenu, {}, [className])}
          direction={'bottom-left'}
          items={items}
          trigger={<MoreVertIcon className={cls.trigger}/>}
      />

  )
})
