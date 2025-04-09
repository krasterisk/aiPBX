import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import React, { memo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAuthData, isUserAdmin, userActions } from '@/entities/User'
import { getRouteAdmin, getRouteProfile, getRouteSettings } from '@/shared/const/router'
import { Avatar } from '@/shared/ui/redesigned/Avatar'
import { Dropdown } from '@/shared/ui/redesigned/Popups'

interface AvatarDropdownProps {
  className?: string
}

export const AvatarDropdown = memo((props: AvatarDropdownProps) => {
  const {
    className
  } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const authData = useSelector(getUserAuthData)
  const isAdmin = useSelector(isUserAdmin)

  const onLogout = useCallback(() => {
    dispatch(userActions.logout())
  }, [dispatch])

  const items = [
    ...(isAdmin
      ? [{
          content: t('Админ'),
          href: getRouteAdmin()
        }]
      : []),
    {
      content: t('Профиль'),
      href: getRouteProfile(String(authData?.id))
    },
    {
      content: t('Настройки'),
      href: getRouteSettings()
    },

    {
      content: t('Выйти'),
      onClick: onLogout
    }
  ]

  return (
        <Dropdown
            className={classNames('', {}, [className])}
            direction={'bottom-left'}
            items={items}
            trigger={<Avatar size={40} src={authData?.avatar}/>}
        />

  )
})
