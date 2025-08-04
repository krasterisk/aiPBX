import { StateSchema } from '@/app/providers/StoreProvider'
import dayjs from 'dayjs'

export const getReportsPageView = (state: StateSchema) => state.reportsPage?.view || 'BIG'
export const getReportsPageManualView = (state: StateSchema) => state.reportsPage?.manualView || false
export const getReportsPageNum = (state: StateSchema) => state.reportsPage?.page || 1
export const getReportsPageLimit = (state: StateSchema) => state.reportsPage?.limit || 25
export const getReportsHasMore = (state: StateSchema) => state.reportsPage?.hasMore
export const getReportsTab = (state: StateSchema) => state.reportsPage?.tab ?? 'day'
export const getReportStartDate = (state: StateSchema) => state.reportsPage?.startDate ?? dayjs().format('YYYY-MM-DD')
export const getReportEndDate = (state: StateSchema) => state.reportsPage?.endDate ?? dayjs().format('YYYY-MM-DD')
export const getReportUserId = (state: StateSchema) => state.reportsPage?.userId ?? ''
export const getReportAssistantId = (state: StateSchema) => state.reportsPage?.assistantId ?? []
export const getReportsInited = (state: StateSchema) => state.reportsPage?._inited
export const getReportsPageSearch = (state: StateSchema) => state.reportsPage?.search ?? ''
