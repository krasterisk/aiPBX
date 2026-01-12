import { AssistantFormSchema } from '../types/assistantFormSchema'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Assistant } from '../types/assistants'
import { initAssistant } from '../const/initAssistant'

const initialState: AssistantFormSchema = {
  data: null,
  mode: 'create',
  isLoading: false
}

export const assistantFormSlice = createSlice({
  name: 'assistantForm',
  initialState,
  reducers: {
    initCreate (state) {
      state.mode = 'create'
      state.data = initAssistant
      state.initialData = undefined
    },

    initEdit (state, action: PayloadAction<Assistant>) {
      state.mode = 'edit'
      state.data = action.payload
      state.initialData = action.payload
    },

    updateForm (state, action: PayloadAction<Partial<Assistant>>) {
      if (state.data) {
        state.data = {
          ...state.data,
          ...action.payload
        }
      }
    },

    resetForm () {
      return initialState
    }
  }
})

export const {
  actions: assistantFormActions,
  reducer: assistantFormReducer
} = assistantFormSlice
