import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'
import { AuthData, UserSchema } from '../types/user'
import { usersApi } from '../../api/usersApi'

const initialState: UserSchema = { _mounted: false, redesigned: false }

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<AuthData>) => {
      const token = action.payload.token
      const authData = action.payload.user
      state.token = token
      state.authData = authData
      localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, token)
      state._mounted = true
    },
    logout: (state) => {
      state.token = undefined
      state.authData = undefined
      localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY)
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      usersApi.endpoints.getMe.matchFulfilled,
      (state, { payload }) => {
        state.authData = payload
        state.token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || undefined
        state._mounted = true
      }
    )
    builder.addMatcher(
      usersApi.endpoints.getMe.matchRejected,
      (state) => {
        state.token = undefined
        state.authData = undefined
        state._mounted = true
      }
    )
  }
})

// Action creators are generated for each case reducer function
export const { actions: userActions } = userSlice
export const { reducer: userReducer } = userSlice
