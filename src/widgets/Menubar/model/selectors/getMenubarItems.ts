import { useSelector } from 'react-redux'
import { getUserAuthData } from '@/entities/User'
import {
  getRouteAssistants, getRouteDashboard, getRouteOnline,
  getRouteReports,
  getRouteTools,
  getRouteUsers
} from '@/shared/const/router'
import EndpointsIcon from '@/shared/assets/icons/endpoints.svg'
import ManualIcon from '@/shared/assets/icons/article.svg'
import { MenubarItemType } from '../types/menubar'
import { useTranslation } from 'react-i18next'

export const useMenubarItems = () => {
  const userData = useSelector(getUserAuthData)
  const { t } = useTranslation()

  const menubarItemsList: MenubarItemType[] = [
    // {
    //   path: getRouteMain(),
    //   Icon: MainIcon,
    //   text: t('Главная')
    // }
  ]
  if (userData) {
    menubarItemsList.push(
      {
        path: getRouteDashboard(),
        Icon: ManualIcon,
        text: t('Дашбоард'),
        authOnly: true
      },
      {
        path: getRouteOnline(),
        Icon: ManualIcon,
        text: t('Онлайн'),
        authOnly: true
      },
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
        path: getRouteReports(),
        Icon: EndpointsIcon,
        text: t('Отчёт'),
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
