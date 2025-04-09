import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './UserMenu.module.scss'
import { useTranslation } from 'react-i18next'
import React, { memo, useCallback } from 'react'
import { getRouteUserEdit } from '@/shared/const/router'
import { Dropdown } from '@/shared/ui/redesigned/Popups'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useDeleteUser } from '../../api/usersApi'
import { useSelector } from 'react-redux'
import { getUserAuthData } from '../../model/selectors/getUserAuthData/getUserAuthData'

interface UserMenuProps {
  className?: string
  id: string
}

export const UserMenu = memo((props: UserMenuProps) => {
  const {
    className,
    id
  } = props
  const { t } = useTranslation('profile')

  const [userDeleteMutation] = useDeleteUser()

  const handlerDelete = useCallback(() => {
    if (id) {
      userDeleteMutation(id).unwrap()
    }
  }, [userDeleteMutation, id])

  const userData = useSelector(getUserAuthData)

  const isCanDelete = id !== userData?.id

  const items = isCanDelete
    ? [
        {
          content: t('Изменить'),
          href: getRouteUserEdit(id)
        },
        {
          content: t('Удалить'),
          onClick: handlerDelete
        }
      ]
    : [
        {
          content: t('Изменить'),
          href: getRouteUserEdit(id)
        }
      ]

  return (
        <Dropdown
            className={classNames(cls.UserMenu, {}, [className])}
            direction={'bottom-left'}
            items={items}
            trigger={<MoreVertIcon className={cls.trigger}/>}
        />

  )
})
