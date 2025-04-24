import { StateSchema } from '@/app/providers/StoreProvider'

export const getReportsPageView = (state: StateSchema) => state.reportsPage?.view || 'SMALL'
export const getReportsPageNum = (state: StateSchema) => state.reportsPage?.page || 1
export const getReportsPageLimit = (state: StateSchema) => state.reportsPage?.limit || 25
export const getReportsHasMore = (state: StateSchema) => state.reportsPage?.hasMore
export const getReportsInited = (state: StateSchema) => state.reportsPage?._inited
export const getReportsPageSearch = (state: StateSchema) => state.reportsPage?.search ?? ''
