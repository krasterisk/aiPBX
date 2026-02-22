import { useSelector } from 'react-redux'
import { getUserAuthData, isUserAdmin } from '@/entities/User'
import {
  getRouteAssistants,
  getRouteDashboardOverview,
  getRouteDashboardAIAnalytics,
  getRoutePbxServers,
  getRoutePlayground,
  getRouteReports,
  getRouteTools,
  getRouteUsers,
  getRoutePayment,
  getRoutePrices,
  getRouteModels,
  getRoutePublishSipUris,
  getRoutePublishWidgets,
  getRouteMcpServers,
  getRouteSpeechAnalyticsDashboard,
  getRouteSpeechAnalyticsCdr,
  getRouteSpeechAnalyticsProjects,
  getRouteSpeechAnalyticsTokens
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
        path: '/dashboards',
        Icon: BarChartIcon,
        text: t('Dashboards'),
        authOnly: true,
        subItems: [
          {
            path: getRouteDashboardOverview(),
            Icon: DashboardIcon,
            text: t('Overview'),
            authOnly: true
          },
          {
            path: getRouteDashboardAIAnalytics(),
            Icon: AnalyticsIcon,
            text: t('AI Analytics'),
            authOnly: true
          },
          {
            path: getRouteReports(),
            Icon: DescriptionIcon,
            text: t('Call Records'),
            authOnly: true
          },
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
        path: '/speech-analytics',
        Icon: RecordVoiceOverIcon,
        text: t('Речевая аналитика'),
        authOnly: true,
        subItems: [
          {
            path: getRouteSpeechAnalyticsDashboard(),
            Icon: DashboardIcon,
            text: t('Дашборд'),
            authOnly: true
          },
          {
            path: getRouteSpeechAnalyticsCdr(),
            Icon: DescriptionIcon,
            text: t('Записи звонков'),
            authOnly: true
          },
          {
            path: getRouteSpeechAnalyticsProjects(),
            Icon: BuildIcon,
            text: t('Проекты'),
            authOnly: true
          },
          {
            path: getRouteSpeechAnalyticsTokens(),
            Icon: AnalyticsIcon,
            text: t('API Токены'),
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
