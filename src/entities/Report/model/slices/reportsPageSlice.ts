import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReportsPageSchema } from '../types/reportsPageSchema'
import { ClientOptions } from '@/entities/User'
import { AssistantOptions } from '@/entities/Assistants'
import { CdrSource } from '../types/report'

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
  sortOrder: 'DESC',
  listGeneration: 0,
  csatFilter: [],
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
    setSource: (state, action: PayloadAction<CdrSource | undefined>) => {
      state.source = action.payload
    },
    applySort: (state, action: PayloadAction<string>) => {
      const field = action.payload
      if (state.sortField === field) {
        state.sortOrder = state.sortOrder === 'ASC' ? 'DESC' : 'ASC'
      } else {
        state.sortField = field
        state.sortOrder = 'ASC'
      }
      state.page = 1
      state.listGeneration = (state.listGeneration ?? 0) + 1
    },
    resetListQuery: (state) => {
      state.page = 1
      state.listGeneration = (state.listGeneration ?? 0) + 1
    },
    toggleCsatFilter: (state, action: PayloadAction<string>) => {
      const value = action.payload
      const current = state.csatFilter ?? []
      state.csatFilter = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
      state.page = 1
      state.listGeneration = (state.listGeneration ?? 0) + 1
    },
    clearCsatFilter: (state) => {
      state.csatFilter = []
      state.page = 1
      state.listGeneration = (state.listGeneration ?? 0) + 1
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
