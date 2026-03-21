import { StateSchema } from '@/app/providers/StoreProvider'

export const getKBPageSearch = (state: StateSchema) =>
  state.knowledgeBasesPage?.search ?? ''
export const getKBPageInited = (state: StateSchema) =>
  state.knowledgeBasesPage?._inited ?? false
export const getKBFormOpen = (state: StateSchema) =>
  state.knowledgeBasesPage?.isFormOpen ?? false
export const getKBEditingKb = (state: StateSchema) =>
  state.knowledgeBasesPage?.editingKb ?? null
