import { useSelector } from 'react-redux'
import { getUserAuthData } from '@/entities/User'
import {
  getRouteAssistants,
  getRouteContexts, getRouteEndpointGroups,
  getRouteEndpoints,
  getRouteMain, getRouteProvisioning
} from '@/shared/const/router'
import MainIcon from '@/shared/assets/icons/home.svg'
import EndpointsIcon from '@/shared/assets/icons/endpoints.svg'
import ContextsIcon from '@/shared/assets/icons/contexts.svg'
import ManualIcon from '@/shared/assets/icons/article.svg'
import { MenubarItemType } from '../types/menubar'
import { useTranslation } from 'react-i18next'

export const useMenubarItems = () => {
  const userData = useSelector(getUserAuthData)
  const { t } = useTranslation()

  const menubarItemsList: MenubarItemType[] = [
    {
      path: getRouteMain(),
      Icon: MainIcon,
      text: t('Главная')
    }
  ]
  if (userData) {
    menubarItemsList.push(
      {
        path: getRouteAssistants(),
        Icon: ManualIcon,
        text: t('Ассистенты'),
        authOnly: true
      },
      {
        path: getRouteEndpoints(),
        Icon: EndpointsIcon,
        text: t('Абоненты'),
        authOnly: false,
        subItems: [
          {
            path: getRouteContexts(),
            Icon: ContextsIcon,
            text: t('Контексты'),
            authOnly: false
          },
          {
            path: getRouteEndpointGroups(),
            Icon: ContextsIcon,
            text: t('Группы'),
            authOnly: false
          },
          {
            path: getRouteProvisioning(),
            Icon: ContextsIcon,
            text: t('Автонастройка'),
            authOnly: false
          }
        ]
      }
    )
  }
  return menubarItemsList
}
