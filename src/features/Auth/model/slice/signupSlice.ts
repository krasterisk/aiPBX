import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SignupSchema } from '../types/signupSchema'

const initialState: SignupSchema = {
  isLoading: false,
  activationCode: '',
  password: '',
  email: ''
}

export const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload
    },
    setActivationCode: (state, action: PayloadAction<string>) => {
      state.activationCode = action.payload
    },

    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { actions: signupActions } = signupSlice
export const { reducer: signupReducer } = signupSlice
