import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface PublishSipUrisPageSchema {
    search: string
    clientId: string
    _inited: boolean
}

const initialState: PublishSipUrisPageSchema = {
    search: '',
    clientId: '',
    _inited: false
}

export const publishSipUrisPageSlice = createSlice({
    name: 'publish-sip-uris-page',
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload
        },
        setClientId: (state, action: PayloadAction<string>) => {
            state.clientId = action.payload
        },
        setInited: (state) => {
            state._inited = true
        }
    }
})

export const { actions: publishSipUrisPageActions } = publishSipUrisPageSlice
export const { reducer: publishSipUrisPageReducer } = publishSipUrisPageSlice
