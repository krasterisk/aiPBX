import { useSelector } from 'react-redux'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import {
  getRouteAssistants,
  getRoutePbxServers,
  getRoutePlayground,
  getRouteTools,
  getRouteUsers,
  getRoutePayment,
  getRoutePrices,
  getRouteModels,
  getRoutePublishSipUris,
  getRoutePublishWidgets,
  getRouteMcpServers,
  getRouteSipTrunks,
  getRouteCalls,
  getRouteDashboard,
  getRouteAnalytics,
  getRouteAnalyticsProjects,
  getRouteAnalyticsApi
} from '@/shared/const/router'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PsychologyIcon from '@mui/icons-material/Psychology'
import ScienceIcon from '@mui/icons-material/Science'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import BuildIcon from '@mui/icons-material/Build'
import DnsIcon from '@mui/icons-material/Dns'
import PeopleIcon from '@mui/icons-material/People'
import PaymentsIcon from '@mui/icons-material/Payments'
import PublicIcon from '@mui/icons-material/Public'
import SendIcon from '@mui/icons-material/Send'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import DescriptionIcon from '@mui/icons-material/Description'
import BarChartIcon from '@mui/icons-material/BarChart'
import HubIcon from '@mui/icons-material/Hub'
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded'
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver'
import { MenubarItemType } from '../types/menubar'
import { useTranslation } from 'react-i18next'

export const useMenubarItems = () => {
  const userData = useSelector(getUserAuthData)
  const { t } = useTranslation()
  const isAdmin = useSelector(isUserAdmin)

  const menubarItemsList: MenubarItemType[] = []

  if (userData) {
    menubarItemsList.push(
      {
        path: getRouteAssistants(),
        Icon: SmartToyIcon,
        text: t('Ассистенты'),
        authOnly: true
      },
      {
        path: getRouteDashboard(),
        Icon: DashboardIcon,
        text: t('Дашборды'),
        authOnly: true
      },
      {
        path: getRouteCalls(),
        Icon: DescriptionIcon,
        text: t('Звонки'),
        authOnly: true
      },
      {
        path: getRouteAnalytics(),
        Icon: AnalyticsIcon,
        text: t('Аналитика'),
        authOnly: true,
        subItems: [
          {
            path: getRouteAnalyticsProjects(),
            Icon: BuildIcon,
            text: t('Проекты'),
            authOnly: true
          },
          {
            path: getRouteAnalyticsApi(),
            Icon: HubIcon,
            text: t('API'),
            authOnly: true
          }
        ]
      },
      {
        path: getRoutePlayground(),
        Icon: ScienceIcon,
        text: t('Playground'),
        authOnly: true
      },
      {
        path: getRouteTools(),
        Icon: BuildIcon,
        text: t('Функции'),
        authOnly: true
      },
      {
        path: getRouteMcpServers(),
        Icon: HubIcon,
        text: t('MCP Серверы'),
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
            path: getRouteSipTrunks(),
            Icon: PhoneForwardedIcon,
            text: t('SIP Trunks'),
            authOnly: true
          },
          {
            path: getRoutePublishWidgets(),
            Icon: SmartToyIcon,
            text: t('Виджеты'),
            authOnly: true
          }
        ]
      },

      {
        path: getRoutePayment(),
        Icon: PaymentsIcon,
        text: t('Оплата'),
        authOnly: true
      },
      ...(isAdmin
        ? [
          {
            path: '/admin',
            Icon: AdminPanelSettingsIcon,
            text: t('Управление'),
            authOnly: true,
            subItems: [
              {
                path: getRouteUsers(),
                Icon: PeopleIcon,
                text: t('Пользователи'),
                authOnly: true
              },
              {
                path: getRouteModels(),
                Icon: PsychologyIcon,
                text: t('AI Модели'),
                authOnly: true
              },
              {
                path: getRoutePrices(),
                Icon: AttachMoneyIcon,
                text: t('Цены'),
                authOnly: true
              },
              {
                path: getRoutePbxServers(),
                Icon: DnsIcon,
                text: t('PBXs'),
                authOnly: true
              }
            ]
          }
        ]
        : []
      )
    )
  }
  return menubarItemsList
}
