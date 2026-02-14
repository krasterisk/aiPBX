import { StateSchema } from '@/app/providers/StoreProvider'

export const getMcpServersPageView = (state: StateSchema) => 'BIG'
export const getMcpServersPageNum = (state: StateSchema) => state.mcpServersPage?.page || 1
export const getMcpServersPageLimit = (state: StateSchema) => state.mcpServersPage?.limit || 250
export const getMcpServersHasMore = (state: StateSchema) => state.mcpServersPage?.hasMore
export const getMcpServersInited = (state: StateSchema) => state.mcpServersPage?._inited
export const getMcpServersPageSearch = (state: StateSchema) => state.mcpServersPage?.search ?? ''
export const getMcpServersRefreshOnFocus = (state: StateSchema) => state.mcpServersPage?.refreshOnFocus ?? true
export const getMcpServersUserId = (state: StateSchema) => state.mcpServersPage?.userId ?? ''
export const getMcpServersUser = (state: StateSchema) => state.mcpServersPage?.user ?? { id: '', name: '' }
