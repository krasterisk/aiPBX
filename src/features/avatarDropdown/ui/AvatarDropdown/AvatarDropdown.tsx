import React, { memo, useCallback } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getUserAuthData, userActions } from '@/entities/User'
import { rtkApi } from '@/shared/api/rtkApi'
import { getRouteDocs, getRouteLegal, getRouteMain, getRoutePayment, getRouteUserEdit } from '@/shared/const/router'
import { Avatar } from '@/shared/ui/redesigned/Avatar'
import { Dropdown } from '@/shared/ui/redesigned/Popups'
import { useNavigate } from 'react-router-dom'
// eslint-disable-next-line krasterisk-plugin/layer-imports
import { onboardingActions, getOnboardingIsActive } from '@/features/Onboarding'

interface AvatarDropdownProps {
  className?: string
}

export const AvatarDropdown = memo((props: AvatarDropdownProps) => {
  const {
    className
  } = props
  const { t } = useTranslation()
  const { t: tOnboarding } = useTranslation('onboarding')
  const dispatch = useDispatch()
  const authData = useSelector(getUserAuthData)
  const isOnboardingActive = useSelector(getOnboardingIsActive)
  const navigate = useNavigate()

  const showOnboardingReentry = Boolean(authData) && !isOnboardingActive

  const onLogout = useCallback(() => {
    dispatch(userActions.logout())
    dispatch(rtkApi.util.resetApiState())
    navigate(getRouteMain())
  }, [dispatch, navigate])

  const onStartOnboarding = useCallback(() => {
    dispatch(onboardingActions.resetForReentry())
    dispatch(onboardingActions.startOnboarding())
  }, [dispatch])

  const items = [
    ...(showOnboardingReentry
      ? [{
        content: tOnboarding('onboarding_reentry', 'Начать обучение'),
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
