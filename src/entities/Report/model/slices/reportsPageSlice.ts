import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReportsPageSchema } from '../types/reportsPageSchema'
import { ClientOptions } from '@/entities/User'
import { AssistantOptions } from '@/entities/Assistants'

const initialState: ReportsPageSchema = {
  page: 1,
  limit: 25,
  hasMore: true,
  // filters
  _inited: false,
  search: '',
  userId: '',
  // sorting
  sortField: 'createdAt',
  sortOrder: 'DESC'
}

export const reportsPageSlice = createSlice({
  name: 'reportsPageSlice',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setTab: (state, action: PayloadAction<string>) => {
      state.tab = action.payload
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload
    },
    setReportsRefreshOnFocus: (state, action: PayloadAction<boolean>) => {
      state.refreshOnFocus = action.payload
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    setAssistantId: (state, action: PayloadAction<string[]>) => {
      state.assistantId = action.payload
    },
    setAssistant: (state, action: PayloadAction<AssistantOptions[]>) => {
      state.assistants = action.payload
    },
    setUser: (state, action: PayloadAction<ClientOptions>) => {
      state.user = action.payload
      state.userId = action.payload.id
    },
    setSortField: (state, action: PayloadAction<string | undefined>) => {
      state.sortField = action.payload
    },
    setSortOrder: (state, action: PayloadAction<'ASC' | 'DESC' | undefined>) => {
      state.sortOrder = action.payload
    },
    initState: (state) => {
      state.limit = 25
      state._inited = true
    }
  }
})

export const {
  actions: reportsPageActions,
  reducer: reportsPageReducer
} = reportsPageSlice
