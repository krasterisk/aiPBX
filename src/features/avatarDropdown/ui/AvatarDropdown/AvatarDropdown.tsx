import React, { memo, useCallback } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAuthData, isUserAdmin, userActions } from '@/entities/User'
import { getRoutePayment, getRouteProfile } from '@/shared/const/router'
import { Avatar } from '@/shared/ui/redesigned/Avatar'
import { Dropdown } from '@/shared/ui/redesigned/Popups'
import { ThemeSwitcher } from '@/entities/ThemeSwitcher'
import { HStack } from '@/shared/ui/redesigned/Stack'

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
    // ...(isAdmin
    //   ? [{
    //       content: t('Админ'),
    //       href: getRouteAdmin()
    //     }]
    //   : []),
    {
      content: t('Профиль'),
      href: getRouteProfile(String(authData?.id))
    },
    {
      content: t('Оплата'),
      href: getRoutePayment()
    },
    {
      content: t('Выйти'),
      onClick: onLogout
    },
    {
      content:
                <HStack max justify={'end'}>
                    <ThemeSwitcher/>
                </HStack>
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
