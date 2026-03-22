import { Chat } from './chat'

export interface ChatsPageSchema {
  _inited: boolean
  search: string
  isFormOpen: boolean
  editingChat: Chat | null
}
