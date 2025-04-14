import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ContentView } from '../../../Content'
import { Tool, ToolParameters } from '../types/tools'
import { ToolsPageSchema } from '../types/toolsPageSchema'
import { TOOLS_VIEW_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'
import { ClientOptions } from '@/entities/User'

const initialState: ToolsPageSchema = {
  page: 1,
  limit: 250,
  hasMore: true,
  // filters
  view: 'SMALL',
  _inited: false,
  search: '',
  userId: '',
  createForm: {
    type: 'function',
    user: {
      id: '',
      name: ''
    }
  },
  editForm: {
    type: 'function',
    id: '',
    name: '',
    userId: ''
  }
}

export const toolsPageSlice = createSlice({
  name: 'toolsPageSlice',
  initialState,
  reducers: {
    resetToolEditForm: (state) => {
      state.editForm = {
        id: '',
        type: 'function',
        name: '',
        comment: '',
        userId: ''
      }
    },
    resetToolCreateForm: (state) => {
      state.createForm = {
        id: '',
        type: 'function',
        name: '',
        comment: '',
        userId: ''
      }
    },
    setView: (state, action: PayloadAction<ContentView>) => {
      state.view = action.payload
      localStorage.setItem(TOOLS_VIEW_LOCALSTORAGE_KEY, action.payload)
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload
    },
    setToolsRefreshOnFocus: (state, action: PayloadAction<boolean>) => {
      state.refreshOnFocus = action.payload
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setUser: (state, action: PayloadAction<ClientOptions>) => {
      state.user = action.payload
      state.userId = action.payload.id
    },
    updateToolEditForm: (state, action: PayloadAction<Tool>) => {
      state.editForm = {
        ...state.editForm,
        ...action.payload
      }
    },
    updateToolEditParameters: (state, action: PayloadAction<ToolParameters>) => {
      state.editForm.parameters = {
        ...state.editForm.parameters,
        ...action.payload
      }
    },
    updateToolCreateParameters: (state, action: PayloadAction<ToolParameters>) => {
      state.createForm.parameters = {
        ...state.createForm.parameters,
        ...action.payload
      }
    },
    updateToolsCreateForm: (state, action: PayloadAction<Tool>) => {
      state.createForm = {
        ...state.createForm,
        ...action.payload
      }
    },

    initState: (state) => {
      const view = localStorage.getItem(TOOLS_VIEW_LOCALSTORAGE_KEY) as ContentView
      state.view = view
      state.limit = view === 'BIG' ? 250 : 250
      state._inited = true
    }
  }
})

export const {
  actions: toolsPageActions,
  reducer: toolsPageReducer
} = toolsPageSlice
