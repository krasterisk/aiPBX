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

export const useSidebarItems = () => {
  const userData = useSelector(getUserAuthData)
  const sidebarItemsList: SidebarItemType[] = [
    {
      path: getRouteMain(),
      Icon: MainIcon,
      text: 'Главная'
    }
  ]
  if (userData) {
    const userId = String(userData.id)
    sidebarItemsList.push(
      {
        path: getRouteEndpoints(),
        Icon: EndpointsIcon,
        text: 'Абоненты',
        authOnly: false
      },
      {
        path: getRouteContexts(),
        Icon: ContextsIcon,
        text: 'Контексты',
        authOnly: false
      },
      {
        path: getRouteProfile(userId),
        Icon: ProfileIcon,
        text: 'Профиль',
        authOnly: true
      }
    )
  }
  return sidebarItemsList
}
