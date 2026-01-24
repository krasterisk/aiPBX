import { StateSchema } from '@/app/providers/StoreProvider'

export const getAssistantsPageView = (state: StateSchema) => 'BIG'
export const getAssistantsPageNum = (state: StateSchema) => state.assistantsPage?.page || 1
export const getAssistantsPageLimit = (state: StateSchema) => state.assistantsPage?.limit || 250
export const getAssistantsHasMore = (state: StateSchema) => state.assistantsPage?.hasMore
export const getAssistantsInited = (state: StateSchema) => state.assistantsPage?._inited
export const getAssistantsPageSearch = (state: StateSchema) => state.assistantsPage?.search ?? ''
export const getAssistantsRefreshOnFocus = (state: StateSchema) => state.assistantsPage?.refreshOnFocus ?? true
export const getAssistantsUserId = (state: StateSchema) => state.assistantsPage?.userId ?? ''
export const getAssistantsUser = (state: StateSchema) => state.assistantsPage?.user
