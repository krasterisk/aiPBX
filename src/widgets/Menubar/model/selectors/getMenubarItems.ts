import { useSelector } from 'react-redux'
import { getUserAuthData } from '@/entities/User'
import {
  getRouteAssistants,
  getRouteMain, getRouteTools, getRouteUsers
} from '@/shared/const/router'
import MainIcon from '@/shared/assets/icons/home.svg'
import EndpointsIcon from '@/shared/assets/icons/endpoints.svg'
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
        path: getRouteTools(),
        Icon: EndpointsIcon,
        text: t('Функции'),
        authOnly: true
      },
      {
        path: getRouteUsers(),
        Icon: EndpointsIcon,
        text: t('Пользователи'),
        authOnly: true
      }
    )
  }
  return menubarItemsList
}
