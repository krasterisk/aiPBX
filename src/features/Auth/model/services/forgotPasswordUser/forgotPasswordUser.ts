import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'

interface forgotPasswordProps {
  email: string
}

export const forgotPasswordUser = createAsyncThunk<
string,
forgotPasswordProps,
ThunkConfig<string>>(
  'common/forgotPassword',
  async (authData, thunkAPI) => {
    const {
      extra,
      rejectWithValue
    } = thunkAPI
    try {
      const response = await extra.api.post<string>('/auth/forgotPassword', authData)
      if (!response.data) {
        throw new Error()
      }
      // localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(response.data))
      // localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, response.data)
      // dispatch(userActions.setToken(response.data))
      return response.data
    } catch (e) {
      return rejectWithValue('error')
    }
  }
)
