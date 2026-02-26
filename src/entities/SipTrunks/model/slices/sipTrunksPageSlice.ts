import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SipTrunksPageSchema } from '../types/sipTrunks'

const initialState: SipTrunksPageSchema = {
    search: '',
    clientId: '',
    _inited: false
}

export const sipTrunksPageSlice = createSlice({
    name: 'sip-trunks-page',
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

export const { actions: sipTrunksPageActions } = sipTrunksPageSlice
export const { reducer: sipTrunksPageReducer } = sipTrunksPageSlice
