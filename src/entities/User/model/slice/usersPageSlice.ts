import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SortOrder } from '@/shared/types/sort'
import { UserSortField } from '../consts/consts'
import { UsersPageSchema } from '../types/usersPageSchema'

const initialState: UsersPageSchema = {
  page: 1,
  limit: 25,
  hasMore: true,
  // filters
  view: 'BIG',
  tab: '',
  _inited: false,
  sort: UserSortField.NAME,
  order: 'asc',
  search: ''
}

export const usersPageSlice = createSlice({
  name: 'usersPageSlice',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setOrder: (state, action: PayloadAction<SortOrder>) => {
      state.order = action.payload
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload
    },
    setTab: (state, action: PayloadAction<string>) => {
      state.tab = action.payload
    },
    setSort: (state, action: PayloadAction<UserSortField>) => {
      state.sort = action.payload
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    initState: (state) => {
      state.view = 'BIG'
      state.limit = 25
      state._inited = true
    }
  }
})

export const {
  actions: usersPageActions,
  reducer: usersPageReducer
} = usersPageSlice
