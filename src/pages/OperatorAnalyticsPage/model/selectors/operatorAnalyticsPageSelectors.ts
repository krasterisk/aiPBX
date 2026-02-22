import { StateSchema } from '@/app/providers/StoreProvider'

export const getOperatorAnalyticsPeriodTab = (state: StateSchema) =>
    state.operatorAnalyticsPage?.periodTab
export const getOperatorAnalyticsOverviewTab = (state: StateSchema) =>
    state.operatorAnalyticsPage?.overviewTab ?? 'dashboard'
export const getOperatorAnalyticsStartDate = (state: StateSchema) =>
    state.operatorAnalyticsPage?.startDate ?? ''
export const getOperatorAnalyticsEndDate = (state: StateSchema) =>
    state.operatorAnalyticsPage?.endDate ?? ''
export const getOperatorAnalyticsOperatorName = (state: StateSchema) =>
    state.operatorAnalyticsPage?.operatorName ?? ''
export const getOperatorAnalyticsProjectId = (state: StateSchema) =>
    state.operatorAnalyticsPage?.projectId ?? ''
export const getOperatorAnalyticsPage = (state: StateSchema) =>
    state.operatorAnalyticsPage?.page ?? 1
export const getOperatorAnalyticsSearch = (state: StateSchema) =>
    state.operatorAnalyticsPage?.search ?? ''
export const getOperatorAnalyticsSortField = (state: StateSchema) =>
    state.operatorAnalyticsPage?.sortField ?? 'createdAt'
export const getOperatorAnalyticsSortOrder = (state: StateSchema) =>
    state.operatorAnalyticsPage?.sortOrder ?? ('DESC' as 'ASC' | 'DESC')
export const getOperatorAnalyticsInited = (state: StateSchema) =>
    state.operatorAnalyticsPage?._inited
