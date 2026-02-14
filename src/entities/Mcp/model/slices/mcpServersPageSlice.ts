import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { McpServersPageSchema } from '../types/mcpServersPageSchema'
import { ClientOptions } from '@/entities/User'

const initialState: McpServersPageSchema = {
    page: 1,
    limit: 250,
    hasMore: true,
    view: 'BIG',
    _inited: false,
    search: '',
    userId: '',
}

export const mcpServersPageSlice = createSlice({
    name: 'mcpServersPageSlice',
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        setHasMore: (state, action: PayloadAction<boolean>) => {
            state.hasMore = action.payload
        },
        setMcpServersRefreshOnFocus: (state, action: PayloadAction<boolean>) => {
            state.refreshOnFocus = action.payload
        },
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload
        },
        setUser: (state, action: PayloadAction<ClientOptions>) => {
            state.user = action.payload
            state.userId = action.payload.id
        },
        initState: (state) => {
            state.view = 'BIG'
            state.limit = 250
            state._inited = true
        },
    },
})

export const {
    actions: mcpServersPageActions,
    reducer: mcpServersPageReducer,
} = mcpServersPageSlice
