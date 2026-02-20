import React, { memo, useCallback } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAuthData, isUserAdmin, userActions } from '@/entities/User'
import { getRouteDocs, getRouteLegal, getRouteMain, getRoutePayment, getRouteUserEdit } from '@/shared/const/router'
import { Avatar } from '@/shared/ui/redesigned/Avatar'
import { Dropdown } from '@/shared/ui/redesigned/Popups'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line krasterisk-plugin/layer-imports
import { onboardingActions, ONBOARDING_STORAGE_KEY } from '@/features/Onboarding'

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

  const onStartOnboarding = useCallback(() => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY)
    dispatch(onboardingActions.startOnboarding())
  }, [dispatch])

  const items = [
    ...(isAdmin
      ? [{
        content: t('Онбординг'),
        onClick: onStartOnboarding
      }]
      : []),
    {
      content: t('Профиль'),
      href: getRouteUserEdit(String(authData?.id))
    },
    {
      content: t('Оплата'),
      href: getRoutePayment()
    },
    {
      content: t('Правовая информация'),
      href: getRouteLegal()
    },
    {
      content: t('Документация'),
      href: getRouteDocs()
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
      trigger={<Avatar size={40} src={authData?.avatar} />}
    />

  )
})
