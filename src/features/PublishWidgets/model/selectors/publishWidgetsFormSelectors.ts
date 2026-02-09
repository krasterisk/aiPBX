import { StateSchema } from '@/app/providers/StoreProvider'

export const getPublishWidgetsFormName = (state: StateSchema) => state.publishWidgetsForm?.name ?? ''
// export const getPublishWidgetsFormSelectedAssistant = (state: StateSchema) => state.publishWidgetsForm?.selectedAssistant
export const getPublishWidgetsFormSelectedAssistant = (state: StateSchema) => state.publishWidgetsForm?.selectedAssistant
export const getPublishWidgetsFormSelectedPbxServer = (state: StateSchema) => state.publishWidgetsForm?.selectedPbxServer
export const getPublishWidgetsFormAllowedDomains = (state: StateSchema) => state.publishWidgetsForm?.allowedDomains ?? ''
export const getPublishWidgetsFormMaxSessions = (state: StateSchema) => state.publishWidgetsForm?.maxConcurrentSessions ?? 10
export const getPublishWidgetsFormMaxSessionDuration = (state: StateSchema) => state.publishWidgetsForm?.maxSessionDuration ?? 600
export const getPublishWidgetsFormIsActive = (state: StateSchema) => state.publishWidgetsForm?.isActive ?? true
export const getPublishWidgetsFormAppearance = (state: StateSchema) => state.publishWidgetsForm?.appearance
export const getPublishWidgetsFormIsLoading = (state: StateSchema) => state.publishWidgetsForm?.isLoading
export const getPublishWidgetsFormUserId = (state: StateSchema) => state.publishWidgetsForm?.userId ?? ''
