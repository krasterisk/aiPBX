import { StateSchema } from '@/app/providers/StoreProvider'

export const getAssistantFormData = (state: StateSchema) =>
  state.assistantForm?.data

export const getAssistantFormMode = (state: StateSchema) =>
  state.assistantForm?.mode ?? 'create'
