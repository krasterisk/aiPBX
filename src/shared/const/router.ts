export enum AppRoutes {
  MAIN = 'main',
  LOGIN = 'login',
  SIGNUP = 'signup',
  ABOUT = 'about',
  ADMIN = 'admin',
  SETTINGS = 'settings',
  REPORTS = 'reports',
  ONLINE = 'online',
  DASHBOARD = 'dashboard',
  PAYMENT = 'payment',
  ASSISTANTS = 'assistants',
  ASSISTANT_CREATE = 'assistant_create',
  ASSISTANT_EDIT = 'assistant_edit',
  TOOLS = 'tools',
  TOOLS_CREATE = 'tools_create',
  TOOLS_EDIT = 'tools_edit',
  PBX_SERVERS = 'pbx_servers',
  PBX_SERVER_CREATE = 'pbx_create',
  PBX_SERVER_EDIT = 'pbx_edit',
  FORBIDDEN = 'forbidden',
  ERROR = 'error',
  USERS = 'users',
  USER_EDIT = 'users_edit',
  USER_CREATE = 'users_create',
}

export const getRouteMain = () => '/'
export const getRouteAbout = () => '/about'
export const getRouteLogin = () => '/login'
export const getRouteSignup = () => '/signup'
export const getRouteAdmin = () => '/admin'
export const getRouteEndpoints = () => '/endpoints'
export const getRouteContexts = () => '/contexts'
export const getRouteSettings = () => '/settings'
export const getRouteAssistants = () => '/assistants'
export const getRouteOnline = () => '/online'
export const getRoutePayment = () => '/payment'
export const getRouteDashboard = () => '/dashboard'
export const getRouteAssistantEdit = (id: string) => `/assistants/${id}`
export const getRouteAssistantCreate = () => '/assistants/create'
export const getRouteReports = () => '/reports'
export const getRouteTools = () => '/tools'
export const getRouteToolsEdit = (id: string) => `/tools/${id}`
export const getRouteToolsCreate = () => '/tools/create'
export const getRoutePbxServers = () => '/pbxServers'
export const getRoutePbxServerEdit = (id: string) => `/pbxServer/${id}`
export const getRoutePbxServerCreate = () => '/pbxServer/create'
export const getRouteProfile = (id: string) => `/profile/${id}`
export const getRouteForbidden = () => '/forbidden'
export const getRouteUsers = () => '/users'
export const getRouteUserCreate = () => '/users/create'
export const getRouteUserEdit = (id: string) => `/users/${id}`

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
  [getRouteMain()]: AppRoutes.MAIN,
  [getRouteLogin()]: AppRoutes.LOGIN,
  [getRouteSignup()]: AppRoutes.SIGNUP,
  [getRouteAbout()]: AppRoutes.ABOUT,
  [getRouteAdmin()]: AppRoutes.ADMIN,
  [getRouteSettings()]: AppRoutes.SETTINGS,
  [getRouteReports()]: AppRoutes.REPORTS,
  [getRoutePayment()]: AppRoutes.PAYMENT,
  [getRouteOnline()]: AppRoutes.ONLINE,
  [getRouteDashboard()]: AppRoutes.DASHBOARD,
  [getRouteAssistants()]: AppRoutes.ASSISTANTS,
  [getRouteAssistantCreate()]: AppRoutes.ASSISTANT_CREATE,
  [getRouteAssistantEdit(':id')]: AppRoutes.ASSISTANT_EDIT,
  [getRouteTools()]: AppRoutes.TOOLS,
  [getRouteToolsCreate()]: AppRoutes.TOOLS_CREATE,
  [getRouteToolsEdit(':id')]: AppRoutes.TOOLS_EDIT,
  [getRouteForbidden()]: AppRoutes.FORBIDDEN,
  [getRouteUsers()]: AppRoutes.USERS,
  [getRouteUserEdit(':id')]: AppRoutes.USER_EDIT,
  [getRouteUserCreate()]: AppRoutes.USER_CREATE
}
