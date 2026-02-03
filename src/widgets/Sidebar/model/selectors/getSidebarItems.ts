import { getUserAuthData } from '@/entities/User'
import { SidebarItemType } from '../types/sidebar'
import MainIcon from '@/shared/assets/icons/home.svg'
import ProfileIcon from '@/shared/assets/icons/avatar.svg'
import EndpointsIcon from '@/shared/assets/icons/endpoints.svg'
import ContextsIcon from '@/shared/assets/icons/contexts.svg'
import {
  getRouteMain,
  getRouteEndpoints,
  getRouteProfile,
  getRouteContexts
} from '@/shared/const/router'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

export const useSidebarItems = () => {
  const { t } = useTranslation()
  const userData = useSelector(getUserAuthData)
  const sidebarItemsList: SidebarItemType[] = [
    {
      path: getRouteMain(),
      Icon: MainIcon,
      text: t('Главная')
    }
  ]
  if (userData) {
    const userId = String(userData.id)
    sidebarItemsList.push(
      {
        path: getRouteEndpoints(),
        Icon: EndpointsIcon,
        text: t('Абоненты'),
        authOnly: false
      },
      {
        path: getRouteContexts(),
        Icon: ContextsIcon,
        text: t('Контексты'),
        authOnly: false
      },
      {
        path: getRouteProfile(userId),
        Icon: ProfileIcon,
        text: t('Профиль'),
        authOnly: true
      }
    )
  }
  return sidebarItemsList
}
