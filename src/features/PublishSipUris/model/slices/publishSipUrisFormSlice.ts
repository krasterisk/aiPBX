import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PublishSipUrisFormSchema } from '../types/publishSipUrisFormSchema'
import { PbxServerOptions } from '@/entities/PbxServers'
import { AssistantOptions } from '@/entities/Assistants'

const initialState: PublishSipUrisFormSchema = {
    selectedAssistant: null,
    selectedPbx: null,
    ipAddress: '',
    records: true,
    tls: true,
    active: true,
    userId: '',
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
        setRecords: (state, action: PayloadAction<boolean>) => {
            state.records = action.payload
        },
        setTls: (state, action: PayloadAction<boolean>) => {
            state.tls = action.payload
        },
        setActive: (state, action: PayloadAction<boolean>) => {
            state.active = action.payload
        },
        setUserId: (state, action: PayloadAction<string>) => {
            state.userId = action.payload
        },
        resetForm: (state) => {
            state.selectedAssistant = null
            state.selectedPbx = null
            state.ipAddress = ''
            state.records = true
            state.tls = true
            state.active = true
            state.userId = ''
        },
        initForm: (state, action: PayloadAction<{ assistant: AssistantOptions, pbx: PbxServerOptions, ip: string, records?: boolean, tls?: boolean, active?: boolean, userId?: string }>) => {
            state.selectedAssistant = action.payload.assistant
            state.selectedPbx = action.payload.pbx
            state.ipAddress = action.payload.ip
            state.records = action.payload.records ?? true
            state.tls = action.payload.tls ?? true
            state.active = action.payload.active ?? true
            state.userId = action.payload.userId ?? ''
        }
    }
})

export const { actions: publishSipUrisFormActions } = publishSipUrisFormSlice
export const { reducer: publishSipUrisFormReducer } = publishSipUrisFormSlice
