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
  PBX_SERVERS = 'publish_pbxs',
  PBX_SERVER_CREATE = 'publish_pbxs_create',
  PBX_SERVER_EDIT = 'publish_pbxs_edit',
  FORBIDDEN = 'forbidden',
  ERROR = 'error',
  USERS = 'users',
  USER_EDIT = 'users_edit',
  USER_CREATE = 'users_create',
  PLAYGROUND = 'playground',
  BILLING = 'billing',
  PAYMENT_DETAILS = 'payment_details',
  DOCS = 'docs',
  PUBLISH_SIP_URIS = 'publish_sips',
  PUBLISH_SIP_URIS_CREATE = 'publish_sips_create',
  PUBLISH_SIP_URIS_EDIT = 'publish_sips_edit',
  PUBLISH_WIDGETS = 'publish_widgets',
  PUBLISH_WIDGETS_CREATE = 'publish_widgets_create',
  PUBLISH_WIDGETS_EDIT = 'publish_widgets_edit',
  PRICES = 'prices',
  MODELS = 'models'
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
export const getRoutePbxServers = () => '/publish/pbxs'
export const getRoutePbxServerEdit = (id: string) => `/publish/pbxs/${id}`
export const getRoutePbxServerCreate = () => '/publish/pbxs/create'
export const getRouteProfile = (id: string) => `/profile/${id}`
export const getRouteForbidden = () => '/forbidden'
export const getRouteUsers = () => '/users'
export const getRouteUserCreate = () => '/users/create'
export const getRouteUserEdit = (id: string) => `/users/${id}`
export const getRoutePlayground = () => '/playground'
export const getRouteBilling = () => '/billing'
export const getRoutePaymentDetails = () => '/payment-history'
export const getRouteDocs = () => '/docs'
export const getRoutePublishSipUris = () => '/publish/sips'
export const getRoutePublishSipUrisCreate = () => '/publish/sips/create'
export const getRoutePublishSipUrisEdit = (id: string) => `/publish/sips/${id}`
export const getRoutePublishWidgets = () => '/publish/widgets'
export const getRoutePublishWidgetsCreate = () => '/publish/widgets/create'
export const getRoutePublishWidgetsEdit = (id: string) => `/publish/widgets/${id}`
export const getRoutePrices = () => '/admin/prices'
export const getRouteModels = () => '/admin/models'


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
  [getRoutePbxServers()]: AppRoutes.PBX_SERVERS,
  [getRoutePbxServerCreate()]: AppRoutes.PBX_SERVER_CREATE,
  [getRoutePbxServerEdit(':id')]: AppRoutes.PBX_SERVER_EDIT,
  [getRouteForbidden()]: AppRoutes.FORBIDDEN,
  [getRouteUsers()]: AppRoutes.USERS,
  [getRouteUserEdit(':id')]: AppRoutes.USER_EDIT,
  [getRouteUserCreate()]: AppRoutes.USER_CREATE,
  [getRoutePlayground()]: AppRoutes.PLAYGROUND,
  [getRouteBilling()]: AppRoutes.BILLING,
  [getRoutePaymentDetails()]: AppRoutes.PAYMENT_DETAILS,
  [getRouteDocs()]: AppRoutes.DOCS,
  [getRoutePublishSipUris()]: AppRoutes.PUBLISH_SIP_URIS,
  [getRoutePublishSipUrisCreate()]: AppRoutes.PUBLISH_SIP_URIS_CREATE,
  [getRoutePublishSipUrisEdit(':id')]: AppRoutes.PUBLISH_SIP_URIS_EDIT,
  [getRoutePublishWidgets()]: AppRoutes.PUBLISH_WIDGETS,
  [getRoutePublishWidgetsCreate()]: AppRoutes.PUBLISH_WIDGETS_CREATE,
  [getRoutePublishWidgetsEdit(':id')]: AppRoutes.PUBLISH_WIDGETS_EDIT,
  [getRoutePrices()]: AppRoutes.PRICES,
  [getRouteModels()]: AppRoutes.MODELS
}
