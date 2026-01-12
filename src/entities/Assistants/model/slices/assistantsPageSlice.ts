import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ContentView } from '../../../Content'
import { AssistantsPageSchema } from '../types/assistantsPageSchema'
import { ASSISTANTS_VIEW_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'
import { ClientOptions } from '../../../User'

const initialState: AssistantsPageSchema = {
  page: 1,
  limit: 250,
  hasMore: true,
  // filters
  view: 'SMALL',
  _inited: false,
  search: '',
  userId: ''
}

export const assistantsPageSlice = createSlice({
  name: 'assistantsPageSlice',
  initialState,
  reducers: {
    setView: (state, action: PayloadAction<ContentView>) => {
      state.view = action.payload
      localStorage.setItem(ASSISTANTS_VIEW_LOCALSTORAGE_KEY, action.payload)
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload
    },
    setAssistantsRefreshOnFocus: (state, action: PayloadAction<boolean>) => {
      state.refreshOnFocus = action.payload
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    setUser: (state, action: PayloadAction<ClientOptions>) => {
      state.user = action.payload
      state.userId = action.payload.id
    },
    initState: (state) => {
      const view = localStorage.getItem(ASSISTANTS_VIEW_LOCALSTORAGE_KEY) as ContentView
      state.view = view
      state.limit = view === 'BIG' ? 250 : 250
      state._inited = true
    }
  }
})

export const {
  actions: assistantsPageActions,
  reducer: assistantsPageReducer
} = assistantsPageSlice
