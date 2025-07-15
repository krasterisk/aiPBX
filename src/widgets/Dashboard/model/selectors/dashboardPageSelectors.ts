import { StateSchema } from '@/app/providers/StoreProvider'

export const getDashboardTab = (state: StateSchema) => state.dashboardPage?.tab ?? 'week'
export const getDashboardStartDate = (state: StateSchema) => state.dashboardPage?.startDate ?? ''
export const getDashboardEndDate = (state: StateSchema) => state.dashboardPage?.endDate ?? ''
export const getDashboardInited = (state: StateSchema) => state.dashboardPage?._inited
export const getDashboardUserId = (state: StateSchema) => state.dashboardPage?.userId ?? ''
export const getDashboardAssistantId = (state: StateSchema) => state.dashboardPage?.assistantId ?? []
