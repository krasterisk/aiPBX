import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PublishWidgetsPageSchema } from '../types/publishWidgets'
import { fetchNextPublishWidgetsPage } from '../service/fetchNextPublishWidgetsPage/fetchNextPublishWidgetsPage'

const initialState: PublishWidgetsPageSchema = {
    isLoading: false,
    error: undefined,
    page: 1,
    hasMore: true,
    limit: 20,
    search: '',
    _inited: false
}

export const publishWidgetsPageSlice = createSlice({
    name: 'publish-widgets-page',
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        setInited: (state) => {
            state._inited = true
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch next page
            .addCase(fetchNextPublishWidgetsPage.pending, (state) => {
                state.error = undefined
                state.isLoading = true
            })
            .addCase(fetchNextPublishWidgetsPage.fulfilled, (state, action) => {
                state.isLoading = false
                state.hasMore = action.payload.hasMore
                state.page = action.payload.page
            })
            .addCase(fetchNextPublishWidgetsPage.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export const { actions: publishWidgetsPageActions } = publishWidgetsPageSlice
export const { reducer: publishWidgetsPageReducer } = publishWidgetsPageSlice
