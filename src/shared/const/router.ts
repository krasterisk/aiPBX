export enum AppRoutes {
  MAIN = 'main',
  ABOUT = 'about',
  ADMIN = 'admin',
  SETTINGS = 'settings',
  ASSISTANTS = 'ASSISTANTS',
  ASSISTANT_CREATE = 'ASSISTANT_create',
  ASSISTANT_EDIT = 'ASSISTANT_edit',
  FORBIDDEN = 'forbidden',
  ERROR = 'error',
  USERS = 'users',
  USER_EDIT = 'users_edit',
  USER_CREATE = 'users_create',
}

export const getRouteMain = () => '/'
export const getRouteAbout = () => '/about'
export const getRouteAdmin = () => '/admin'
export const getRouteEndpoints = () => '/endpoints'
export const getRouteContexts = () => '/contexts'
export const getRouteSettings = () => '/settings'
export const getRouteAssistants = () => '/assistants'
export const getRouteAssistantDetails = (id: string) => `/assistants/${id}`
export const getRouteAssistantEdit = (id: string) => `/assistants/${id}`
export const getRouteAssistantCreate = () => '/assistants/create'
export const getRouteEndpointCreate = () => '/endpoints/create'
export const getRouteContextCreate = () => '/contexts/create'
export const getRouteContextEdit = (id: string) => `/contexts/${id}`
export const getRouteEndpointEdit = (id: string) => `/endpoints/${id}`
export const getRouteEndpointGroups = () => '/endpoints-groups'
export const getRouteEndpointGroupsCreate = () => '/endpoints-groups/create'
export const getRouteEndpointGroupsEdit = (id: string) => `/endpoints-groups/${id}`
export const getRouteProvisioning = () => '/provisioning'
export const getRouteProvisioningCreate = () => '/provisioning/create'
export const getRouteProvisioningEdit = (id: string) => `/provisioning/${id}`
export const getRouteProfile = (id: string) => `/profile/${id}`
export const getRouteForbidden = () => '/forbidden'
export const getRouteUsers = () => '/users'
export const getRouteUserCreate = () => '/users/create'
export const getRouteUserEdit = (id: string) => `/users/${id}`

export const AppRouteByPathPattern: Record<string, AppRoutes> = {
  [getRouteMain()]: AppRoutes.MAIN,
  [getRouteAbout()]: AppRoutes.ABOUT,
  [getRouteAdmin()]: AppRoutes.ADMIN,
  [getRouteSettings()]: AppRoutes.SETTINGS,
  [getRouteAssistants()]: AppRoutes.ASSISTANTS,
  [getRouteAssistantCreate()]: AppRoutes.ASSISTANT_CREATE,
  [getRouteAssistantEdit(':id')]: AppRoutes.ASSISTANT_EDIT,
  [getRouteForbidden()]: AppRoutes.FORBIDDEN,
  [getRouteUsers()]: AppRoutes.USERS,
  [getRouteUserEdit(':id')]: AppRoutes.USER_EDIT,
  [getRouteUserCreate()]: AppRoutes.USER_CREATE
}
