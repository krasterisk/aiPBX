import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AssistantsPageSchema } from '../types/assistantsPageSchema'
import { ClientOptions } from '../../../User'

const initialState: AssistantsPageSchema = {
  page: 1,
  limit: 250,
  hasMore: true,
  // filters
  view: 'BIG',
  _inited: false,
  search: '',
  userId: ''
}

export const assistantsPageSlice = createSlice({
  name: 'assistantsPageSlice',
  initialState,
  reducers: {
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
      state.view = 'BIG'
      state.limit = 250
      state._inited = true
    }
  }
})

export const {
  actions: assistantsPageActions,
  reducer: assistantsPageReducer
} = assistantsPageSlice
