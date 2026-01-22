import { useSelector } from 'react-redux'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import {
  getRouteAssistants,
  getRouteDashboard,
  getRouteOnline, getRoutePbxServers,
  getRoutePlayground,
  getRouteReports,
  getRouteTools,
  getRouteUsers
} from '@/shared/const/router'
import DashboardIcon from '@mui/icons-material/Dashboard'
import WifiTetheringIcon from '@mui/icons-material/WifiTethering'
import ScienceIcon from '@mui/icons-material/Science'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import BuildIcon from '@mui/icons-material/Build'
import AssessmentIcon from '@mui/icons-material/Assessment'
import DnsIcon from '@mui/icons-material/Dns'
import PeopleIcon from '@mui/icons-material/People'
import { MenubarItemType } from '../types/menubar'
import { useTranslation } from 'react-i18next'

export const useMenubarItems = () => {
  const userData = useSelector(getUserAuthData)
  const { t } = useTranslation()
  const isAdmin = useSelector(isUserAdmin)

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
        Icon: DashboardIcon,
        text: t('Дашбоард'),
        authOnly: true
      },
      {
        path: getRouteOnline(),
        Icon: WifiTetheringIcon,
        text: t('Онлайн'),
        authOnly: true
      },
      {
        path: getRoutePlayground(),
        Icon: ScienceIcon,
        text: t('Playground'),
        authOnly: true
      },
      {
        path: getRouteAssistants(),
        Icon: SmartToyIcon,
        text: t('Ассистенты'),
        authOnly: true
      },
      {
        path: getRouteTools(),
        Icon: BuildIcon,
        text: t('Функции'),
        authOnly: true
      },
      {
        path: getRouteReports(),
        Icon: AssessmentIcon,
        text: t('Отчёт'),
        authOnly: true
      },
      ...(isAdmin
        ? [
          {
            path: getRoutePbxServers(),
            Icon: DnsIcon,
            text: t('VoIP Серверы'),
            authOnly: true
          },
          {
            path: getRouteUsers(),
            Icon: PeopleIcon,
            text: t('Пользователи'),
            authOnly: true
          }
        ]
        : []
      )
    )
  }
  return menubarItemsList
}
