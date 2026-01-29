import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PublishSipUrisPageSchema {
    search: string
    _inited: boolean
}

const initialState: PublishSipUrisPageSchema = {
    search: '',
    _inited: false
}

export const publishSipUrisPageSlice = createSlice({
    name: 'publish-sip-uris-page',
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload
        },
        setInited: (state) => {
            state._inited = true
        }
    }
})

export const { actions: publishSipUrisPageActions } = publishSipUrisPageSlice
export const { reducer: publishSipUrisPageReducer } = publishSipUrisPageSlice
