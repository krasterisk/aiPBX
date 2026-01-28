import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PublishWidgetsFormSchema } from '../types/publishWidgetsFormSchema'
import { AssistantOptions } from '@/entities/Assistants'
import { DEFAULT_APPEARANCE_SETTINGS, WidgetKey } from '@/entities/WidgetKeys'

const initialState: PublishWidgetsFormSchema = {
    name: '',
    selectedAssistant: null,
    allowedDomains: [],
    maxConcurrentSessions: 10,
    appearance: DEFAULT_APPEARANCE_SETTINGS,
    isLoading: false
}

export const publishWidgetsFormSlice = createSlice({
    name: 'publishWidgetsForm',
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload
        },
        setSelectedAssistant: (state, action: PayloadAction<AssistantOptions | null>) => {
            state.selectedAssistant = action.payload
        },
        setAllowedDomains: (state, action: PayloadAction<string[]>) => {
            state.allowedDomains = action.payload
        },
        setMaxConcurrentSessions: (state, action: PayloadAction<number>) => {
            state.maxConcurrentSessions = action.payload
        },
        setAppearance: (state, action: PayloadAction<Partial<PublishWidgetsFormSchema['appearance']>>) => {
            state.appearance = { ...state.appearance, ...action.payload }
        },
        resetForm: (state) => {
            return initialState
        },
        initForm: (state, action: PayloadAction<WidgetKey>) => {
            const widget = action.payload
            state.name = widget.name
            state.selectedAssistant = widget.assistant ? {
                id: String(widget.assistant.id),
                name: widget.assistant.name || ''
            } : null
            try {
                state.allowedDomains = JSON.parse(widget.allowedDomains)
            } catch (e) {
                state.allowedDomains = []
            }
            state.maxConcurrentSessions = widget.maxConcurrentSessions
            // Assuming appearance comes from widget.settings or similar
            // If the API doesn't return it yet, keep defaults
        }
    }
})

export const { actions: publishWidgetsFormActions } = publishWidgetsFormSlice
export const { reducer: publishWidgetsFormReducer } = publishWidgetsFormSlice
