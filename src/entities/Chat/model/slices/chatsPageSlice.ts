import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ChatsPageSchema } from '../types/chatsPageSchema'
import { Chat } from '../types/chat'

const initialState: ChatsPageSchema = {
  _inited: false,
  search: '',
  isFormOpen: false,
  editingChat: null
}

export const chatsPageSlice = createSlice({
  name: 'chatsPageSlice',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    openCreateForm: (state) => {
      state.isFormOpen = true
      state.editingChat = null
    },
    openEditForm: (state, action: PayloadAction<Chat>) => {
      state.isFormOpen = true
      state.editingChat = action.payload
    },
    closeForm: (state) => {
      state.isFormOpen = false
      state.editingChat = null
    },
    initState: (state) => {
      state._inited = true
    }
  }
})

export const {
  actions: chatsPageActions,
  reducer: chatsPageReducer
} = chatsPageSlice
