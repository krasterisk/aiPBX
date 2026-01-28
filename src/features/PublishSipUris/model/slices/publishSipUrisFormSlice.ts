import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PublishSipUrisFormSchema } from '../types/publishSipUrisFormSchema'
import { PbxServerOptions } from '@/entities/PbxServers'
import { AssistantOptions } from '@/entities/Assistants'

const initialState: PublishSipUrisFormSchema = {
    selectedAssistant: null,
    selectedPbx: null,
    ipAddress: '',
    isLoading: false
}

export const publishSipUrisFormSlice = createSlice({
    name: 'publishSipUrisForm',
    initialState,
    reducers: {
        setSelectedAssistant: (state, action: PayloadAction<AssistantOptions | null>) => {
            state.selectedAssistant = action.payload
        },
        setSelectedPbx: (state, action: PayloadAction<PbxServerOptions | null>) => {
            state.selectedPbx = action.payload
        },
        setIpAddress: (state, action: PayloadAction<string>) => {
            state.ipAddress = action.payload
        },
        resetForm: (state) => {
            state.selectedAssistant = null
            state.selectedPbx = null
            state.ipAddress = ''
        },
        initForm: (state, action: PayloadAction<{ assistant: AssistantOptions, pbx: PbxServerOptions, ip: string }>) => {
            state.selectedAssistant = action.payload.assistant
            state.selectedPbx = action.payload.pbx
            state.ipAddress = action.payload.ip
        }
    }
})

export const { actions: publishSipUrisFormActions } = publishSipUrisFormSlice
export const { reducer: publishSipUrisFormReducer } = publishSipUrisFormSlice
