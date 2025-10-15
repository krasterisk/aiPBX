import { StateSchema } from '@/app/providers/StoreProvider'

export const getPbxServersPageView = (state: StateSchema) => state.pbxServersPage?.view || 'SMALL'
export const getPbxServersPageNum = (state: StateSchema) => state.pbxServersPage?.page || 1
export const getPbxServersPageLimit = (state: StateSchema) => state.pbxServersPage?.limit || 250
export const getPbxServersHasMore = (state: StateSchema) => state.pbxServersPage?.hasMore
export const getPbxServersInited = (state: StateSchema) => state.pbxServersPage?._inited
export const getPbxServersPageSearch = (state: StateSchema) => state.pbxServersPage?.search ?? ''
export const getPbxServersRefreshOnFocus = (state: StateSchema) => state.pbxServersPage?.refreshOnFocus ?? true
export const getPbxServersUserId = (state: StateSchema) => state.pbxServersPage?.userId ?? ''
export const getPbxServersUser = (state: StateSchema) => state.pbxServersPage?.user ?? { id: '', name: '' }
export const getPbxServersCreateForm = (state: StateSchema) => state.pbxServersPage?.createForm
export const getPbxServersEditForm = (state: StateSchema) => state.pbxServersPage?.editForm
