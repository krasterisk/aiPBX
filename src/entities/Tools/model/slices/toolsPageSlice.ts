import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Tool, ToolParameters } from '../types/tools'
import { ToolsPageSchema } from '../types/toolsPageSchema'
import { ClientOptions } from '@/entities/User'

const initialState: ToolsPageSchema = {
  page: 1,
  limit: 250,
  hasMore: true,
  // filters
  view: 'BIG',
  _inited: false,
  search: '',
  userId: '',
  createForm: {
    type: '',
    user: {
      id: '',
      name: ''
    }
  },
  editForm: {
    type: '',
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
        type: '',
        name: '',
        toolData: {
          type: 'mcp',
          server_label: 'dmcp',
          server_url: 'https://mymcpserver.dev/sse',
          require_approval: 'never'
        },
        comment: '',
        userId: ''
      }
    },
    resetToolCreateForm: (state) => {
      state.createForm = {
        id: '',
        type: '',
        name: '',
        toolData: {
          type: 'mcp',
          server_label: 'dmcp',
          server_url: 'https://mymcpserver.dev/sse',
          require_approval: 'never'
        },
        comment: '',
        userId: ''
      }
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
    updateToolCreateType: (state, action: PayloadAction<string>) => {
      state.createForm.type = action.payload
    },
    updateToolEditType: (state, action: PayloadAction<string>) => {
      state.editForm.type = action.payload
    },

    initState: (state) => {
      state.view = 'BIG'
      state.limit = 250
      state._inited = true
    }
  }
})

export const {
  actions: toolsPageActions,
  reducer: toolsPageReducer
} = toolsPageSlice
