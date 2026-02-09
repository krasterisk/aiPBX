import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AIAnalyticsPageSchema } from '../types/aiAnalyticsPageSchema'
import { AssistantOptions } from '@/entities/Assistants'
import { ClientOptions } from '@/entities/User'

const initialState: AIAnalyticsPageSchema = {
    tab: 'week',
    startDate: '',
    endDate: '',
    userId: ''
}

export const aiAnalyticsPageSlice = createSlice({
    name: 'aiAnalyticsPage',
    initialState,
    reducers: {
        setTab: (state, action: PayloadAction<string>) => {
            state.tab = action.payload
        },
        setStartDate: (state, action: PayloadAction<string>) => {
            state.startDate = action.payload
        },
        setEndDate: (state, action: PayloadAction<string>) => {
            state.endDate = action.payload
        },
        setUserId: (state, action: PayloadAction<string>) => {
            state.userId = action.payload
        },
        setAssistantId: (state, action: PayloadAction<string[]>) => {
            state.assistantId = action.payload
        },
        setAssistant: (state, action: PayloadAction<AssistantOptions[]>) => {
            state.assistants = action.payload
        },
        setUser: (state, action: PayloadAction<ClientOptions>) => {
            state.user = action.payload
            state.userId = action.payload.id
        },
        initState: (state) => {
            state._inited = true
            state.tab = 'week'
        }
    }
})

export const { actions: aiAnalyticsPageActions } = aiAnalyticsPageSlice
export const { reducer: aiAnalyticsPageReducer } = aiAnalyticsPageSlice
