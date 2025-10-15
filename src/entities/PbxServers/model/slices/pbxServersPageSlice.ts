import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ContentView } from '../../../Content'
import { PbxServer } from '../types/pbxServers'
import { PbxServersPageSchema } from '../types/pbxServersPageSchema'
import { PBX_VIEW_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'
import { ClientOptions } from '@/entities/User'

const initialState: PbxServersPageSchema = {
  page: 1,
  limit: 250,
  hasMore: true,
  // filters
  view: 'SMALL',
  _inited: false,
  search: '',
  userId: '',
  createForm: {
    user: {
      id: '',
      name: ''
    }
  },
  editForm: {
    id: '',
    name: '',
    userId: ''
  }
}

export const pbxServersPageSlice = createSlice({
  name: 'pbxServersPageSlice',
  initialState,
  reducers: {
    resetPbxServerEditForm: (state) => {
      state.editForm = {
        id: '',
        name: '',
        userId: ''
      }
    },
    resetPbxServerCreateForm: (state) => {
      state.createForm = {
        id: '',
        name: '',
        userId: ''
      }
    },
    setView: (state, action: PayloadAction<ContentView>) => {
      state.view = action.payload
      localStorage.setItem(PBX_VIEW_LOCALSTORAGE_KEY, action.payload)
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload
    },
    setPbxServersRefreshOnFocus: (state, action: PayloadAction<boolean>) => {
      state.refreshOnFocus = action.payload
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setUser: (state, action: PayloadAction<ClientOptions>) => {
      state.user = action.payload
      state.userId = action.payload.id
    },
    updatePbxServerEditForm: (state, action: PayloadAction<PbxServer>) => {
      state.editForm = {
        ...state.editForm,
        ...action.payload
      }
    },
    updatePbxServersCreateForm: (state, action: PayloadAction<PbxServer>) => {
      state.createForm = {
        ...state.createForm,
        ...action.payload
      }
    },

    initState: (state) => {
      const view = localStorage.getItem(PBX_VIEW_LOCALSTORAGE_KEY) as ContentView
      state.view = view
      state.limit = view === 'BIG' ? 250 : 250
      state._inited = true
    }
  }
})

export const {
  actions: pbxServersPageActions,
  reducer: pbxServersPageReducer
} = pbxServersPageSlice
