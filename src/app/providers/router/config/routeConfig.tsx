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
  getRouteToolsEdit, getRouteReports
} from '@/shared/const/router'
import { AppRoutesProps } from '@/shared/types/router'
import { SettingPage } from '@/pages/SettingsPage'
import { AssistantsCreatePage, AssistantsPage, AssistantsEditPage } from '@/pages/AssistantsPage'
import { UsersCreatePage, UsersEditPage, UsersPage } from '@/pages/UsersPage'
import { ToolsCreatePage, ToolsEditPage, ToolsPage } from '@/pages/ToolsPage'
import { ReportsPage } from '@/pages/ReportPage'

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
  [AppRoutes.MAIN]: {
    path: getRouteMain(),
    element: <MainPage/>
  },
  [AppRoutes.ABOUT]: {
    path: getRouteAbout(),
    element: <AboutPage/>
  },
  [AppRoutes.REPORTS]: {
    path: getRouteReports(),
    element: <ReportsPage />
  },
  [AppRoutes.ASSISTANTS]: {
    path: getRouteAssistants(),
    element: <AssistantsPage />
  },
  [AppRoutes.ASSISTANT_CREATE]: {
    path: getRouteAssistantCreate(),
    element: <AssistantsCreatePage />
  },
  [AppRoutes.ASSISTANT_EDIT]: {
    path: getRouteAssistantEdit(':id'),
    element: <AssistantsEditPage />
  },
  [AppRoutes.TOOLS]: {
    path: getRouteTools(),
    element: <ToolsPage />
  },
  [AppRoutes.TOOLS_CREATE]: {
    path: getRouteToolsCreate(),
    element: <ToolsCreatePage />
  },
  [AppRoutes.TOOLS_EDIT]: {
    path: getRouteToolsEdit(':id'),
    element: <ToolsEditPage />
  },
  [AppRoutes.USERS]: {
    path: getRouteUsers(),
    element: <UsersPage />
  },
  [AppRoutes.USER_CREATE]: {
    path: getRouteUserCreate(),
    element: <UsersCreatePage />
  },
  [AppRoutes.USER_EDIT]: {
    path: getRouteUserEdit(':id'),
    element: <UsersEditPage />
  },
  [AppRoutes.ADMIN]: {
    path: getRouteAdmin(),
    element: <AdminPage/>,
    authOnly: true,
    roles: [UserRolesValues.ADMIN, UserRolesValues.USER]
  },
  [AppRoutes.SETTINGS]: {
    path: getRouteSettings(),
    element: <SettingPage />,
    authOnly: false
  },
  [AppRoutes.FORBIDDEN]: {
    path: getRouteForbidden(),
    element: <ForbiddenPage/>
  },
  [AppRoutes.ERROR]: {
    path: '*',
    element: <ErrorPage/>
  }

}
