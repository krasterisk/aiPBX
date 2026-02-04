import { StateSchema } from '@/app/providers/StoreProvider'

export const getPublishWidgetsPageIsLoading = (state: StateSchema) => state.publishWidgetsPage?.isLoading
export const getPublishWidgetsPageError = (state: StateSchema) => state.publishWidgetsPage?.error
export const getPublishWidgetsPagePage = (state: StateSchema) => state.publishWidgetsPage?.page || 1
export const getPublishWidgetsPageLimit = (state: StateSchema) => state.publishWidgetsPage?.limit || 20
export const getPublishWidgetsPageHasMore = (state: StateSchema) => state.publishWidgetsPage?.hasMore
export const getPublishWidgetsPageSearch = (state: StateSchema) => state.publishWidgetsPage?.search ?? ''
export const getPublishWidgetsPageInited = (state: StateSchema) => state.publishWidgetsPage?._inited
export const getPublishWidgetsPageClientId = (state: StateSchema) => state.publishWidgetsPage?.clientId || ''
