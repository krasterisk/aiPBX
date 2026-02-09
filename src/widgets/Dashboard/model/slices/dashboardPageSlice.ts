import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DashboardPageSchema, DashboardTab } from '../types/dashboardPageSchema'
import { AssistantOptions } from '@/entities/Assistants'
import { ClientOptions } from '@/entities/User'

const initialState: DashboardPageSchema = {
  tab: 'week',
  activeTab: 'overview',
  startDate: '',
  endDate: '',
  userId: ''
}

export const dashboardPageSlice = createSlice({
  name: 'dashboardPage',
  initialState,
  reducers: {
    setTab: (state, action: PayloadAction<string>) => {
      state.tab = action.payload
    },
    setActiveTab: (state, action: PayloadAction<DashboardTab>) => {
      state.activeTab = action.payload
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
      state.activeTab = 'overview'
    }
  }
})

export const { actions: dashboardPageActions } = dashboardPageSlice
export const { reducer: dashboardPageReducer } = dashboardPageSlice
