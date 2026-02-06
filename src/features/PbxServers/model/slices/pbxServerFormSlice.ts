import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PbxServer } from '@/entities/PbxServers'
import { PbxServerFormSchema } from '../types/pbxServerFormSchema'

const initialState: PbxServerFormSchema = {
    form: {
        name: '',
        location: '',
        sip_host: '',
        wss_url: '',
        ari_url: '',
        ari_user: '',
        password: '',
        comment: '',
        context: '',
        moh: '',
        recordFormat: '',
        cloudPbx: false,
    },
    isLoading: false,
}

export const pbxServerFormSlice = createSlice({
    name: 'pbxServerForm',
    initialState,
    reducers: {
        updateForm: (state, action: PayloadAction<Partial<PbxServer>>) => {
            state.form = {
                ...state.form,
                ...action.payload,
            }
        },
        resetForm: (state) => {
            state.form = initialState.form
        },
        initForm: (state, action: PayloadAction<PbxServer>) => {
            state.form = action.payload
        },
    },
})

export const { actions: pbxServerFormActions } = pbxServerFormSlice
export const { reducer: pbxServerFormReducer } = pbxServerFormSlice
