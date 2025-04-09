import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { USERS_VIEW_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'
import { ContentView } from '../../../Content'
import { SortOrder } from '@/shared/types/sort'
import { UserSortField } from '../consts/consts'
import { UsersPageSchema } from '../types/usersPageSchema'

const initialState: UsersPageSchema = {
  page: 1,
  limit: 25,
  hasMore: true,
  // filters
  view: 'SMALL',
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
    setView: (state, action: PayloadAction<ContentView>) => {
      state.view = action.payload
      localStorage.setItem(USERS_VIEW_LOCALSTORAGE_KEY, action.payload)
    },
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
      const view = localStorage.getItem(USERS_VIEW_LOCALSTORAGE_KEY) as ContentView
      state.view = view
      state.limit = view === 'BIG' ? 25 : 25
      state._inited = true
    }
  }
})

export const {
  actions: usersPageActions,
  reducer: usersPageReducer
} = usersPageSlice
