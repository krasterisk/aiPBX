import { StateSchema } from '@/app/providers/StoreProvider'

export const getAIAnalyticsTab = (state: StateSchema) => state.aiAnalyticsPage?.tab ?? 'week'
export const getAIAnalyticsStartDate = (state: StateSchema) => state.aiAnalyticsPage?.startDate ?? ''
export const getAIAnalyticsEndDate = (state: StateSchema) => state.aiAnalyticsPage?.endDate ?? ''
export const getAIAnalyticsInited = (state: StateSchema) => state.aiAnalyticsPage?._inited
export const getAIAnalyticsUserId = (state: StateSchema) => state.aiAnalyticsPage?.userId ?? ''
export const getAIAnalyticsAssistantId = (state: StateSchema) => state.aiAnalyticsPage?.assistantId ?? []
export const getAIAnalyticsAssistants = (state: StateSchema) => state.aiAnalyticsPage?.assistants ?? []
export const getAIAnalyticsSource = (state: StateSchema) => state.aiAnalyticsPage?.source
