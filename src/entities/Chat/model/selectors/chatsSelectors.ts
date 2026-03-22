import { StateSchema } from '@/app/providers/StoreProvider'

export const getChatsPageSearch = (state: StateSchema) =>
  state.chatsPage?.search ?? ''
export const getChatsPageInited = (state: StateSchema) =>
  state.chatsPage?._inited ?? false
export const getChatsFormOpen = (state: StateSchema) =>
  state.chatsPage?.isFormOpen ?? false
export const getChatsEditingChat = (state: StateSchema) =>
  state.chatsPage?.editingChat ?? null
