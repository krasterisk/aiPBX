import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PlaygroundAssistantFormSchema } from '../types/playgroundAssistantFormSchema'
import { Assistant } from '@/entities/Assistants'

const initialState: PlaygroundAssistantFormSchema = {
    data: null,
    isLoading: false,
    error: undefined
}

export const playgroundAssistantFormSlice = createSlice({
    name: 'playgroundAssistantForm',
    initialState,
    reducers: {
        initForm(state, action: PayloadAction<Assistant>) {
            state.data = action.payload
            state.error = undefined
        },

        updateFormField(state, action: PayloadAction<Partial<Assistant>>) {
            if (state.data) {
                state.data = {
                    ...state.data,
                    ...action.payload
                }
            }
        },

        setLoading(state, action: PayloadAction<boolean>) {
            state.isLoading = action.payload
        },

        setError(state, action: PayloadAction<string | undefined>) {
            state.error = action.payload
        },

        resetForm() {
            return initialState
        }
    }
})

export const {
    actions: playgroundAssistantFormActions,
    reducer: playgroundAssistantFormReducer
} = playgroundAssistantFormSlice
