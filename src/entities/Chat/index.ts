export { ChatsList } from './ui/ChatsList/ChatsList'
export { ChatItem } from './ui/ChatItem/ChatItem'
export { ChatFormModal } from './ui/ChatFormModal/ChatFormModal'

export { useChatsPage } from './lib/hooks/useChatsPage'

export {
  chatsPageActions,
  chatsPageReducer
} from './model/slices/chatsPageSlice'

export {
  getChatsPageSearch,
  getChatsPageInited,
  getChatsFormOpen,
  getChatsEditingChat
} from './model/selectors/chatsSelectors'

export type { ChatsPageSchema } from './model/types/chatsPageSchema'

export type {
  Chat,
  ChatMessage,
  ChatToolCall,
  SendMessageRequest,
  CreateChatDto,
  UpdateChatDto
} from './model/types/chat'

export {
  chatApi,
  useChats,
  useChatById,
  useCreateChat,
  useUpdateChat,
  useDeleteChat
} from './api/chatApi'
