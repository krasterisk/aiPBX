import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PublishWidgetsFormSchema } from '../types/publishWidgetsFormSchema'
import { AssistantOptions } from '@/entities/Assistants'
import { DEFAULT_APPEARANCE_SETTINGS, WidgetKey } from '@/entities/WidgetKeys'
import { PbxServerOptions } from '@/entities/PbxServers'

const initialState: PublishWidgetsFormSchema = {
    name: '',
    selectedAssistant: null,
    selectedPbxServer: null,
    allowedDomains: '',
    maxConcurrentSessions: 10,
    maxSessionDuration: 600,
    isActive: true,
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
        setSelectedPbxServer: (state, action: PayloadAction<PbxServerOptions | null>) => {
            state.selectedPbxServer = action.payload
        },
        setAllowedDomains: (state, action: PayloadAction<string>) => {
            state.allowedDomains = action.payload
        },
        setMaxConcurrentSessions: (state, action: PayloadAction<number>) => {
            state.maxConcurrentSessions = action.payload
        },
        setMaxSessionDuration: (state, action: PayloadAction<number>) => {
            state.maxSessionDuration = action.payload
        },
        setIsActive: (state, action: PayloadAction<boolean>) => {
            state.isActive = action.payload
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

            state.selectedPbxServer = widget.pbxServer ? {
                id: String(widget.pbxServer.id),
                name: widget.pbxServer.name || '',
                uniqueId: widget.pbxServer.uniqueId
            } : null

            // Parse allowedDomains - handle multiple formats and convert to newline-separated string
            if (widget.allowedDomains) {
                try {
                    const parsed = typeof widget.allowedDomains === 'string'
                        ? JSON.parse(widget.allowedDomains)
                        : widget.allowedDomains

                    const domainsArray = Array.isArray(parsed) ? parsed : [parsed]
                    state.allowedDomains = domainsArray.join('\n')
                } catch (e) {
                    state.allowedDomains = typeof widget.allowedDomains === 'string' ? widget.allowedDomains : ''
                }
            } else {
                state.allowedDomains = ''
            }

            state.maxConcurrentSessions = widget.maxConcurrentSessions
            state.maxSessionDuration = widget.maxSessionDuration
            state.isActive = widget.isActive

            // Parse appearance if exists
            state.appearance = { ...DEFAULT_APPEARANCE_SETTINGS }
            if (widget.appearance) {
                try {
                    const parsedAppearance = typeof widget.appearance === 'string'
                        ? JSON.parse(widget.appearance)
                        : widget.appearance
                    state.appearance = { ...state.appearance, ...parsedAppearance }
                } catch (e) {
                    console.error('Failed to parse appearance settings', e)
                }
            }

            // If widget has a top-level language field, sync it with appearance (source of truth)
            if (widget.language) {
                state.appearance.language = widget.language as any
            }

            if (widget.logo) {
                state.appearance.logo = widget.logo
            }
        }
    }
})

export const { actions: publishWidgetsFormActions } = publishWidgetsFormSlice
export const { reducer: publishWidgetsFormReducer } = publishWidgetsFormSlice
