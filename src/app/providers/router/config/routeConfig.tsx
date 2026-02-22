import { MainPage } from '@/pages/MainPage'
import { AboutPage } from '@/pages/AboutPage'
import { AdminPage } from '@/pages/AdminPage'
import { UserRolesValues } from '@/entities/User'
import { ForbiddenPage } from '@/pages/ForbiddenPage'
import { ErrorPage } from '@/pages/ErrorPage'
import {
  AppRoutes,
  getRouteAbout,
  getRouteAdmin,
  getRouteForbidden,
  getRouteMain,
  getRouteSettings,
  getRouteAssistants,
  getRouteAssistantCreate,
  getRouteAssistantEdit,
  getRouteUsers,
  getRouteUserCreate,
  getRouteUserEdit,
  getRouteTools,
  getRouteToolsCreate,
  getRouteToolsEdit,
  getRouteReports,
  getRouteOnline,
  getRouteDashboard,
  getRoutePayment,
  getRouteSignup,
  getRouteLogin,
  getRoutePbxServers,
  getRoutePbxServerCreate,
  getRoutePbxServerEdit,
  getRoutePlayground,
  getRouteBilling,
  getRoutePaymentDetails,
  getRouteDocs,
  getRoutePublishSipUris,
  getRoutePublishSipUrisCreate,
  getRoutePublishSipUrisEdit,
  getRoutePublishWidgets,
  getRoutePublishWidgetsCreate,
  getRoutePublishWidgetsEdit,
  getRoutePrices,
  getRouteModels,
  getRouteDashboardOverview,
  getRouteDashboardAIAnalytics,
  getRouteDashboardCallRecords,
  getRouteLegal,
  getRouteLegalTerms,
  getRouteLegalPrivacy,
  getRouteLegalDpa,
  getRouteLegalPublicOffer,
  getRouteLegalPersonalData,
  getRouteLegalLiability,
  getRouteMcpServers,
  getRouteMcpServerCreate,
  getRouteMcpServerEdit,
  getRouteOperatorAnalytics,
  getRouteSpeechAnalyticsDashboard,
  getRouteSpeechAnalyticsCdr,
  getRouteSpeechAnalyticsProjects,
  getRouteSpeechAnalyticsTokens
} from '@/shared/const/router'
import { AppRoutesProps } from '@/shared/types/router'

import { SettingPage } from '@/pages/SettingsPage'
import { PricesPage } from '@/pages/PricesPage'
import { ModelsPage } from '@/pages/ModelsPage'
import { AssistantsCreatePage, AssistantsPage, AssistantsEditPage } from '@/pages/AssistantsPage'
import { UsersCreatePage, UsersEditPage, UsersPage } from '@/pages/UsersPage'
import { ToolsCreatePage, ToolsEditPage, ToolsPage } from '@/pages/ToolsPage'
import { ReportsPage } from '@/pages/ReportPage'
import { OnlinePage } from '@/pages/OnlinePage'
import { PaymentPage } from '@/pages/PaymentPage'
import { LoginPage } from '@/pages/LoginPage'
import { SignupPage } from '@/pages/SignupPage'
import {
  PbxServerCreatePage,
  PbxServerEditPage,
  PbxServersPage
} from '@/pages/PbxServersPage'
import { PlaygroundPage } from '@/pages/Playground'
import { BillingPage } from '@/pages/BillingPage'
import { PaymentDetailsPage } from '@/pages/PaymentDetailsPage'
import { DocsPage } from '@/pages/DocsPage'
import {
  PublishSipUrisPage,
  PublishSipUriCreatePage,
  PublishSipUriEditPage,
  PublishWidgetsPage,
  PublishWidgetCreatePage,
  PublishWidgetEditPage
} from '@/pages/PublishPage'
import { DashboardOverviewPage } from '@/pages/DashboardOverviewPage'
import { AIAnalyticsPage } from '@/pages/AIAnalyticsPage'
import { DashboardCallRecordsPage } from '@/pages/DashboardCallRecordsPage'
import {
  LegalPage,
  TermsOfServicePage,
  PrivacyPolicyPage,
  DpaPage,
  PublicOfferPage,
  PersonalDataPolicyPage,
  LiabilityDisclaimerPage
} from '@/pages/LegalPage'
import { McpServersPage, McpServerEditPage, McpServerCreatePage } from '@/pages/McpServersPage'
import { OperatorAnalyticsPage } from '@/pages/OperatorAnalyticsPage'
import { lazy } from 'react'
const SpeechDashboardPage = lazy(() => import('@/pages/OperatorAnalyticsPage/ui/SpeechDashboardPage/SpeechDashboardPage'))
const SpeechCdrPage = lazy(() => import('@/pages/OperatorAnalyticsPage/ui/SpeechCdrPage/SpeechCdrPage'))
const SpeechProjectsPage = lazy(() => import('@/pages/OperatorAnalyticsPage/ui/SpeechProjectsPage/SpeechProjectsPage'))
const SpeechTokensPage = lazy(() => import('@/pages/OperatorAnalyticsPage/ui/SpeechTokensPage/SpeechTokensPage'))
import { Navigate } from 'react-router-dom'

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
  [AppRoutes.MAIN]: {
    path: getRouteMain(),
    element: <MainPage />
  },
  [AppRoutes.ABOUT]: {
    path: getRouteAbout(),
    element: <AboutPage />
  },
  [AppRoutes.LOGIN]: {
    path: getRouteLogin(),
    element: <LoginPage />
  },
  [AppRoutes.SIGNUP]: {
    path: getRouteSignup(),
    element: <SignupPage />
  },
  [AppRoutes.ONLINE]: {
    path: getRouteOnline(),
    authOnly: true,
    element: <OnlinePage />
  },
  [AppRoutes.DASHBOARD]: {
    path: getRouteDashboard(),
    authOnly: true,
    element: <Navigate to={getRouteDashboardOverview()} replace />
  },
  [AppRoutes.DASHBOARD_OVERVIEW]: {
    path: getRouteDashboardOverview(),
    authOnly: true,
    element: <DashboardOverviewPage />
  },
  [AppRoutes.DASHBOARD_AI_ANALYTICS]: {
    path: getRouteDashboardAIAnalytics(),
    authOnly: true,
    element: <AIAnalyticsPage />
  },
  [AppRoutes.DASHBOARD_CALL_RECORDS]: {
    path: getRouteDashboardCallRecords(),
    authOnly: true,
    element: <DashboardCallRecordsPage />
  },
  [AppRoutes.PAYMENT]: {
    path: getRoutePayment(),
    element: <PaymentPage />,
    authOnly: true,
    roles: [UserRolesValues.ADMIN, UserRolesValues.USER]
  },
  [AppRoutes.REPORTS]: {
    path: getRouteReports(),
    authOnly: true,
    element: <ReportsPage />
  },
  [AppRoutes.ASSISTANTS]: {
    path: getRouteAssistants(),
    authOnly: true,
    element: <AssistantsPage />
  },
  [AppRoutes.ASSISTANT_CREATE]: {
    path: getRouteAssistantCreate(),
    authOnly: true,
    element: <AssistantsCreatePage />
  },
  [AppRoutes.ASSISTANT_EDIT]: {
    path: getRouteAssistantEdit(':id'),
    authOnly: true,
    element: <AssistantsEditPage />
  },
  [AppRoutes.TOOLS]: {
    path: getRouteTools(),
    authOnly: true,
    element: <ToolsPage />
  },
  [AppRoutes.TOOLS_CREATE]: {
    path: getRouteToolsCreate(),
    authOnly: true,
    element: <ToolsCreatePage />
  },
  [AppRoutes.TOOLS_EDIT]: {
    path: getRouteToolsEdit(':id'),
    authOnly: true,
    element: <ToolsEditPage />
  },
  [AppRoutes.PBX_SERVERS]: {
    path: getRoutePbxServers(),
    authOnly: true,
    element: <PbxServersPage />
  },
  [AppRoutes.PBX_SERVER_CREATE]: {
    path: getRoutePbxServerCreate(),
    authOnly: true,
    element: <PbxServerCreatePage />
  },
  [AppRoutes.PBX_SERVER_EDIT]: {
    path: getRoutePbxServerEdit(':id'),
    authOnly: true,
    element: <PbxServerEditPage />
  },
  [AppRoutes.USERS]: {
    path: getRouteUsers(),
    authOnly: true,
    element: <UsersPage />,
    roles: [UserRolesValues.ADMIN]
  },
  [AppRoutes.USER_CREATE]: {
    path: getRouteUserCreate(),
    authOnly: true,
    element: <UsersCreatePage />,
    roles: [UserRolesValues.ADMIN]
  },
  [AppRoutes.USER_EDIT]: {
    path: getRouteUserEdit(':id'),
    authOnly: true,
    element: <UsersEditPage />
  },
  [AppRoutes.ADMIN]: {
    path: getRouteAdmin(),
    element: <AdminPage />,
    authOnly: true,
    roles: [UserRolesValues.ADMIN, UserRolesValues.USER]
  },
  [AppRoutes.SETTINGS]: {
    path: getRouteSettings(),
    element: <SettingPage />,
    authOnly: true
  },
  [AppRoutes.PLAYGROUND]: {
    path: getRoutePlayground(),
    element: <PlaygroundPage />,
    authOnly: true
  },
  [AppRoutes.FORBIDDEN]: {
    path: getRouteForbidden(),
    element: <ForbiddenPage />
  },
  [AppRoutes.BILLING]: {
    path: getRouteBilling(),
    element: <BillingPage />,
    authOnly: true
  },
  [AppRoutes.PAYMENT_DETAILS]: {
    path: getRoutePaymentDetails(),
    element: <PaymentDetailsPage />,
    authOnly: true
  },
  [AppRoutes.DOCS]: {
    path: getRouteDocs(),
    element: <DocsPage />,
    authOnly: false
  },
  [AppRoutes.PUBLISH_SIP_URIS]: {
    path: getRoutePublishSipUris(),
    element: <PublishSipUrisPage />,
    authOnly: true
  },
  [AppRoutes.PUBLISH_SIP_URIS_CREATE]: {
    path: getRoutePublishSipUrisCreate(),
    element: <PublishSipUriCreatePage />,
    authOnly: true
  },
  [AppRoutes.PUBLISH_SIP_URIS_EDIT]: {
    path: getRoutePublishSipUrisEdit(':id'),
    element: <PublishSipUriEditPage />,
    authOnly: true
  },
  [AppRoutes.PUBLISH_WIDGETS]: {
    path: getRoutePublishWidgets(),
    element: <PublishWidgetsPage />,
    authOnly: true
  },
  [AppRoutes.PUBLISH_WIDGETS_CREATE]: {
    path: getRoutePublishWidgetsCreate(),
    element: <PublishWidgetCreatePage />,
    authOnly: true
  },
  [AppRoutes.PUBLISH_WIDGETS_EDIT]: {
    path: getRoutePublishWidgetsEdit(':id'),
    element: <PublishWidgetEditPage />,
    authOnly: true
  },
  [AppRoutes.ERROR]: {
    path: '*',
    element: <ErrorPage />
  },
  [AppRoutes.PRICES]: {
    path: getRoutePrices(),
    element: <PricesPage />,
    authOnly: true,
    roles: [UserRolesValues.ADMIN]
  },
  [AppRoutes.MODELS]: {
    path: getRouteModels(),
    element: <ModelsPage />,
    authOnly: true,
    roles: [UserRolesValues.ADMIN]
  },
  [AppRoutes.LEGAL]: {
    path: getRouteLegal(),
    element: <LegalPage />,
    authOnly: false
  },
  [AppRoutes.LEGAL_TERMS]: {
    path: getRouteLegalTerms(),
    element: <TermsOfServicePage />,
    authOnly: false
  },
  [AppRoutes.LEGAL_PRIVACY]: {
    path: getRouteLegalPrivacy(),
    element: <PrivacyPolicyPage />,
    authOnly: false
  },
  [AppRoutes.LEGAL_DPA]: {
    path: getRouteLegalDpa(),
    element: <DpaPage />,
    authOnly: false
  },
  [AppRoutes.LEGAL_PUBLIC_OFFER]: {
    path: getRouteLegalPublicOffer(),
    element: <PublicOfferPage />,
    authOnly: false
  },
  [AppRoutes.LEGAL_PERSONAL_DATA]: {
    path: getRouteLegalPersonalData(),
    element: <PersonalDataPolicyPage />,
    authOnly: false
  },
  [AppRoutes.LEGAL_LIABILITY]: {
    path: getRouteLegalLiability(),
    element: <LiabilityDisclaimerPage />,
    authOnly: false
  },
  [AppRoutes.MCP_SERVERS]: {
    path: getRouteMcpServers(),
    authOnly: true,
    element: <McpServersPage />
  },
  [AppRoutes.MCP_SERVER_CREATE]: {
    path: getRouteMcpServerCreate(),
    authOnly: true,
    element: <McpServerCreatePage />
  },
  [AppRoutes.MCP_SERVER_EDIT]: {
    path: getRouteMcpServerEdit(':id'),
    authOnly: true,
    element: <McpServerEditPage />
  },
  [AppRoutes.OPERATOR_ANALYTICS]: {
    path: getRouteOperatorAnalytics(),
    authOnly: true,
    element: <OperatorAnalyticsPage />
  },
  [AppRoutes.SPEECH_ANALYTICS_DASHBOARD]: {
    path: getRouteSpeechAnalyticsDashboard(),
    authOnly: true,
    element: <SpeechDashboardPage />
  },
  [AppRoutes.SPEECH_ANALYTICS_CDR]: {
    path: getRouteSpeechAnalyticsCdr(),
    authOnly: true,
    element: <SpeechCdrPage />
  },
  [AppRoutes.SPEECH_ANALYTICS_PROJECTS]: {
    path: getRouteSpeechAnalyticsProjects(),
    authOnly: true,
    element: <SpeechProjectsPage />
  },
  [AppRoutes.SPEECH_ANALYTICS_TOKENS]: {
    path: getRouteSpeechAnalyticsTokens(),
    authOnly: true,
    element: <SpeechTokensPage />
  }

}
