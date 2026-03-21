import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { KnowledgeBasesPageSchema } from '../types/knowledgeBasesPageSchema'
import { KnowledgeBase } from '../types/knowledgeBase'

const initialState: KnowledgeBasesPageSchema = {
  _inited: false,
  search: '',
  isFormOpen: false,
  editingKb: null
}

export const knowledgeBasesPageSlice = createSlice({
  name: 'knowledgeBasesPageSlice',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    openCreateForm: (state) => {
      state.isFormOpen = true
      state.editingKb = null
    },
    openEditForm: (state, action: PayloadAction<KnowledgeBase>) => {
      state.isFormOpen = true
      state.editingKb = action.payload
    },
    closeForm: (state) => {
      state.isFormOpen = false
      state.editingKb = null
    },
    initState: (state) => {
      state._inited = true
    }
  }
})

export const {
  actions: knowledgeBasesPageActions,
  reducer: knowledgeBasesPageReducer
} = knowledgeBasesPageSlice
