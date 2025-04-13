import { StateSchema } from '@/app/providers/StoreProvider'

export const getToolsPageView = (state: StateSchema) => state.toolsPage?.view || 'SMALL'
export const getToolsPageNum = (state: StateSchema) => state.toolsPage?.page || 1
export const getToolsPageLimit = (state: StateSchema) => state.toolsPage?.limit || 250
export const getToolsHasMore = (state: StateSchema) => state.toolsPage?.hasMore
export const getToolsInited = (state: StateSchema) => state.toolsPage?._inited
export const getToolsPageSearch = (state: StateSchema) => state.toolsPage?.search ?? ''
export const getToolsRefreshOnFocus = (state: StateSchema) => state.toolsPage?.refreshOnFocus ?? true
export const getToolsUserId = (state: StateSchema) => state.toolsPage?.userId ?? ''
export const getToolsUser = (state: StateSchema) => state.toolsPage?.user ?? { id: '', name: '' }
export const getToolsCreateParameters = (state: StateSchema) => state.toolsPage?.createForm.parameters
export const getToolsEditParameters = (state: StateSchema) => state.toolsPage?.editForm.parameters
