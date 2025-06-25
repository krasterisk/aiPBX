import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ContentView } from '../../../Content'
import { ReportsPageSchema } from '../types/reportsPageSchema'
import { REPORTS_VIEW_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'
import { ClientOptions } from '@/entities/User'
import { AssistantOptions } from '@/entities/Assistants'

const initialState: ReportsPageSchema = {
  page: 1,
  limit: 250,
  hasMore: true,
  // filters
  view: 'SMALL',
  _inited: false,
  search: '',
  userId: ''
}

export const reportsPageSlice = createSlice({
  name: 'reportsPageSlice',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<ContentView>) => {
      state.view = action.payload
      localStorage.setItem(REPORTS_VIEW_LOCALSTORAGE_KEY, action.payload)
    },
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
    initState: (state) => {
      const view = localStorage.getItem(REPORTS_VIEW_LOCALSTORAGE_KEY) as ContentView
      state.view = view
      state.limit = view === 'BIG' ? 25 : 25
      state._inited = true
    }
  }
})

export const {
  actions: reportsPageActions,
  reducer: reportsPageReducer
} = reportsPageSlice
