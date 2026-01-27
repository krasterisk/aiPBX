import { StateSchema } from '@/app/providers/StoreProvider'

export const getPlaygroundFormData = (state: StateSchema) =>
    state.playgroundAssistantForm?.data

export const getPlaygroundFormLoading = (state: StateSchema) =>
    state.playgroundAssistantForm?.isLoading ?? false

export const getPlaygroundFormError = (state: StateSchema) =>
    state.playgroundAssistantForm?.error
