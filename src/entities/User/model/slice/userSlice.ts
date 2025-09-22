import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'
import { AuthData, User, UserSchema } from '../types/user'

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
      // state.redesigned = getUserFeatureData(token)
      // state.authData = getTokenAllData(token)
      localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, token)
    },
    initAuth: (state, user: PayloadAction<User>) => {
      const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY)
      console.log('USER FORM USERSLICE: ', user)
      if (token) {
        state.token = token
      }
      state.authData = user.payload
      state._mounted = true
    },
    logout: (state) => {
      state.token = undefined
      state.authData = undefined
      localStorage.removeItem(TOKEN_LOCALSTORAGE_KEY)
    }
  }
})

// Action creators are generated for each case reducer function
export const { actions: userActions } = userSlice
export const { reducer: userReducer } = userSlice
