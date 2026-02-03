import { useSelector } from 'react-redux'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import {
  getRouteAssistants,
  getRouteDashboard,
  getRoutePbxServers,
  getRoutePlayground,
  getRouteReports,
  getRouteTools,
  getRouteUsers,
  getRoutePayment,
  getRouteDocs
} from '@/shared/const/router'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ScienceIcon from '@mui/icons-material/Science'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import BuildIcon from '@mui/icons-material/Build'
import AssessmentIcon from '@mui/icons-material/Assessment'
import DnsIcon from '@mui/icons-material/Dns'
import PeopleIcon from '@mui/icons-material/People'
import PaymentsIcon from '@mui/icons-material/Payments'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import PublicIcon from '@mui/icons-material/Public'
import SendIcon from '@mui/icons-material/Send'
import { MenubarItemType } from '../types/menubar'
import { useTranslation } from 'react-i18next'
import { getRoutePublishSipUris, getRoutePublishWidgets } from '@/shared/const/router'

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
      // {
      //   path: getRouteOnline(),
      //   Icon: WifiTetheringIcon,
      //   text: t('Онлайн'),
      //   authOnly: true
      // },
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
        path: getRoutePlayground(),
        Icon: ScienceIcon,
        text: t('Playground'),
        authOnly: true
      },
      {
        path: '/publish',
        Icon: PublicIcon,
        text: t('Публикация'),
        authOnly: true,
        subItems: [
          {
            path: getRoutePublishSipUris(),
            Icon: SendIcon,
            text: t('SIPs'),
            authOnly: true
          },
          {
            path: getRoutePublishWidgets(),
            Icon: SmartToyIcon,
            text: t('Виджеты'),
            authOnly: true
          },
          {
            path: getRoutePbxServers(),
            Icon: DnsIcon,
            text: t('PBXs'),
            authOnly: true
          }
        ]
      },
      {
        path: getRouteReports(),
        Icon: AssessmentIcon,
        text: t('Отчёт'),
        authOnly: true
      },
      {
        path: getRoutePayment(),
        Icon: PaymentsIcon,
        text: t('Оплата'),
        authOnly: true
      },
      {
        path: getRouteDocs(),
        Icon: MenuBookIcon,
        text: t('Документация'),
        authOnly: true
      },
      ...(isAdmin
        ? [
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
