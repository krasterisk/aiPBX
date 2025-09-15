import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'
import { UserSchema } from '../types/user'
import { setFeatureFlags } from '@/shared/lib/features'
import { getTokenAllData, getUserFeatureData } from '@/app/providers/getTokenData/getTokenData'

const initialState: UserSchema = { _mounted: false, redesigned: false }

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      const token = action.payload
      state.redesigned = getUserFeatureData(token)
      state.authData = getTokenAllData(token)
      localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, token)
    },
    initToken: (state) => {
      const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY)

      if (token) {
        state.token = token
        state.authData = getTokenAllData(token)
        state.redesigned = getUserFeatureData(token)
        setFeatureFlags({ isAppRedesigned: getUserFeatureData(token) })
      }
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
