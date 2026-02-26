export enum AppRoutes {
  MAIN = 'main',
  LOGIN = 'login',
  SIGNUP = 'signup',
  ABOUT = 'about',
  ADMIN = 'admin',
  SETTINGS = 'settings',
  CALLS = 'calls',
  ANALYTICS = 'analytics',
  ANALYTICS_PROJECTS = 'analytics_projects',
  ANALYTICS_API = 'analytics_api',
  ONLINE = 'online',
  DASHBOARD = 'dashboard',
  DASHBOARD_OVERVIEW = 'dashboard_overview',
  DASHBOARD_AI_ANALYTICS = 'dashboard_ai_analytics',
  DASHBOARD_CALL_RECORDS = 'dashboard_call_records',
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
  MODELS = 'models',
  LEGAL = 'legal',
  LEGAL_TERMS = 'legal_terms',
  LEGAL_PRIVACY = 'legal_privacy',
  LEGAL_DPA = 'legal_dpa',
  LEGAL_PUBLIC_OFFER = 'legal_public_offer',
  LEGAL_PERSONAL_DATA = 'legal_personal_data',
  LEGAL_LIABILITY = 'legal_liability',
  MCP_SERVERS = 'mcp_servers',
  MCP_SERVER_CREATE = 'mcp_server_create',
  MCP_SERVER_EDIT = 'mcp_server_edit',

  SIP_TRUNKS = 'sip_trunks',
  SIP_TRUNK_CREATE = 'sip_trunk_create',
  SIP_TRUNK_EDIT = 'sip_trunk_edit'
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
export const getRouteDashboardOverview = () => '/dashboard/overview'
export const getRouteDashboardAIAnalytics = () => '/dashboard/ai-analytics'
export const getRouteDashboardCallRecords = () => '/dashboard/call-records'
export const getRouteAssistantEdit = (id: string) => `/assistants/${id}`
export const getRouteAssistantCreate = () => '/assistants/create'
export const getRouteCalls = () => '/calls'
export const getRouteAnalytics = () => '/analytics'
export const getRouteAnalyticsProjects = () => '/analytics/projects'
export const getRouteAnalyticsApi = () => '/analytics/api'
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
export const getRouteLegal = () => '/legal'
export const getRouteLegalTerms = () => '/legal/terms-of-service'
export const getRouteLegalPrivacy = () => '/legal/privacy-policy'
export const getRouteLegalDpa = () => '/legal/dpa'
export const getRouteLegalPublicOffer = () => '/legal/public-offer'
export const getRouteLegalPersonalData = () => '/legal/personal-data-policy'
export const getRouteLegalLiability = () => '/legal/liability-disclaimer'
export const getRouteMcpServers = () => '/mcp-servers'
export const getRouteMcpServerCreate = () => '/mcp-servers/create'
export const getRouteMcpServerEdit = (id: string) => `/mcp-servers/${id}`

export const getRouteSipTrunks = () => '/publish/sip-trunks'
export const getRouteSipTrunkCreate = () => '/publish/sip-trunks/create'
export const getRouteSipTrunkEdit = (id: string) => `/publish/sip-trunks/${id}`

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
  [getRouteMain()]: AppRoutes.MAIN,
  [getRouteLogin()]: AppRoutes.LOGIN,
  [getRouteSignup()]: AppRoutes.SIGNUP,
  [getRouteAbout()]: AppRoutes.ABOUT,
  [getRouteAdmin()]: AppRoutes.ADMIN,
  [getRouteSettings()]: AppRoutes.SETTINGS,
  [getRouteCalls()]: AppRoutes.CALLS,
  [getRouteAnalytics()]: AppRoutes.ANALYTICS,
  [getRouteAnalyticsProjects()]: AppRoutes.ANALYTICS_PROJECTS,
  [getRouteAnalyticsApi()]: AppRoutes.ANALYTICS_API,
  [getRoutePayment()]: AppRoutes.PAYMENT,
  [getRouteOnline()]: AppRoutes.ONLINE,
  [getRouteDashboard()]: AppRoutes.DASHBOARD,
  [getRouteDashboardOverview()]: AppRoutes.DASHBOARD_OVERVIEW,
  [getRouteDashboardAIAnalytics()]: AppRoutes.DASHBOARD_AI_ANALYTICS,
  [getRouteDashboardCallRecords()]: AppRoutes.DASHBOARD_CALL_RECORDS,
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
  [getRouteModels()]: AppRoutes.MODELS,
  [getRouteLegal()]: AppRoutes.LEGAL,
  [getRouteLegalTerms()]: AppRoutes.LEGAL_TERMS,
  [getRouteLegalPrivacy()]: AppRoutes.LEGAL_PRIVACY,
  [getRouteLegalDpa()]: AppRoutes.LEGAL_DPA,
  [getRouteLegalPublicOffer()]: AppRoutes.LEGAL_PUBLIC_OFFER,
  [getRouteLegalPersonalData()]: AppRoutes.LEGAL_PERSONAL_DATA,
  [getRouteLegalLiability()]: AppRoutes.LEGAL_LIABILITY,
  [getRouteMcpServers()]: AppRoutes.MCP_SERVERS,
  [getRouteMcpServerCreate()]: AppRoutes.MCP_SERVER_CREATE,
  [getRouteMcpServerEdit(':id')]: AppRoutes.MCP_SERVER_EDIT,

  [getRouteSipTrunks()]: AppRoutes.SIP_TRUNKS,
  [getRouteSipTrunkCreate()]: AppRoutes.SIP_TRUNK_CREATE,
  [getRouteSipTrunkEdit(':id')]: AppRoutes.SIP_TRUNK_EDIT
}
