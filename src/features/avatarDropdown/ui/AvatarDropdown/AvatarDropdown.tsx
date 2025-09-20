import React, { memo, useCallback } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAuthData, isUserAdmin, userActions } from '@/entities/User'
import { getRouteMain, getRoutePayment, getRouteUserEdit } from '@/shared/const/router'
import { Avatar } from '@/shared/ui/redesigned/Avatar'
import { Dropdown } from '@/shared/ui/redesigned/Popups'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()

  const onLogout = useCallback(() => {
    dispatch(userActions.logout())
    navigate(getRouteMain())
  }, [dispatch, navigate])

  const items = [
    // ...(isAdmin
    //   ? [{
    //       content: t('Админ'),
    //       href: getRouteAdmin()
    //     }]
    //   : []),
    {
      content: t('Профиль'),
      href: getRouteUserEdit(String(authData?.id))
    },
    {
      content: t('Оплата'),
      href: getRoutePayment()
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
