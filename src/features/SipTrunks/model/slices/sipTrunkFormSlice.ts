import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SipTrunkFormSchema, SipTrunkType, SipTransport } from '../types/sipTrunkFormSchema'
import { PbxServerOptions } from '@/entities/PbxServers'
import { AssistantOptions } from '@/entities/Assistants'

const initialState: SipTrunkFormSchema = {
    selectedAssistant: null,
    selectedPbx: null,
    name: '',
    trunkType: 'registration',
    sipServerAddress: '',
    transport: 'udp',
    authName: '',
    password: '',
    domain: '',
    callerId: '',
    providerIp: '',
    active: true,
    records: false,
    userId: '',
    isLoading: false
}

export const sipTrunkFormSlice = createSlice({
    name: 'sipTrunkForm',
    initialState,
    reducers: {
        setSelectedAssistant: (state, action: PayloadAction<AssistantOptions | null>) => {
            state.selectedAssistant = action.payload
        },
        setSelectedPbx: (state, action: PayloadAction<PbxServerOptions | null>) => {
            state.selectedPbx = action.payload
        },
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload
        },
        setTrunkType: (state, action: PayloadAction<SipTrunkType>) => {
            state.trunkType = action.payload
        },
        setSipServerAddress: (state, action: PayloadAction<string>) => {
            state.sipServerAddress = action.payload
        },
        setTransport: (state, action: PayloadAction<SipTransport>) => {
            state.transport = action.payload
        },
        setAuthName: (state, action: PayloadAction<string>) => {
            state.authName = action.payload
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload
        },
        setDomain: (state, action: PayloadAction<string>) => {
            state.domain = action.payload
        },
        setCallerId: (state, action: PayloadAction<string>) => {
            state.callerId = action.payload
        },
        setProviderIp: (state, action: PayloadAction<string>) => {
            state.providerIp = action.payload
        },
        setActive: (state, action: PayloadAction<boolean>) => {
            state.active = action.payload
        },
        setRecords: (state, action: PayloadAction<boolean>) => {
            state.records = action.payload
        },
        setUserId: (state, action: PayloadAction<string>) => {
            state.userId = action.payload
        },
        resetForm: (state) => {
            Object.assign(state, initialState)
        },
        initForm: (state, action: PayloadAction<{
            assistant: AssistantOptions
            pbx: PbxServerOptions
            name: string
            trunkType?: SipTrunkType
            sipServerAddress: string
            transport?: SipTransport
            authName?: string
            password?: string
            domain?: string
            callerId?: string
            providerIp?: string
            active?: boolean
            records?: boolean
            userId?: string
        }>) => {
            state.selectedAssistant = action.payload.assistant
            state.selectedPbx = action.payload.pbx
            state.name = action.payload.name
            state.trunkType = action.payload.trunkType ?? 'registration'
            state.sipServerAddress = action.payload.sipServerAddress
            state.transport = action.payload.transport ?? 'udp'
            state.authName = action.payload.authName ?? ''
            state.password = action.payload.password ?? ''
            state.domain = action.payload.domain ?? ''
            state.callerId = action.payload.callerId ?? ''
            state.providerIp = action.payload.providerIp ?? ''
            state.active = action.payload.active ?? true
            state.records = action.payload.records ?? false
            state.userId = action.payload.userId ?? ''
        }
    }
})

export const { actions: sipTrunkFormActions } = sipTrunkFormSlice
export const { reducer: sipTrunkFormReducer } = sipTrunkFormSlice
