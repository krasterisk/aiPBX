import { StateSchema } from '@/app/providers/StoreProvider'

export const getPublishSipUrisFormSelectedAssistant = (state: StateSchema) => state.publishSipUrisForm?.selectedAssistant
export const getPublishSipUrisFormSelectedPbx = (state: StateSchema) => state.publishSipUrisForm?.selectedPbx
export const getPublishSipUrisFormIpAddress = (state: StateSchema) => state.publishSipUrisForm?.ipAddress
export const getPublishSipUrisFormIsLoading = (state: StateSchema) => state.publishSipUrisForm?.isLoading
export const getPublishSipUrisFormError = (state: StateSchema) => state.publishSipUrisForm?.error
