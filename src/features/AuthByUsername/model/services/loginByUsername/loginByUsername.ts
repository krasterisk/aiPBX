import { userActions } from '@/entities/User'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { TOKEN_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'
import { ThunkConfig } from '@/app/providers/StoreProvider'

interface loginByUsernameProps {
  username: string
  password: string
}

export const loginByUsername = createAsyncThunk<
string,
loginByUsernameProps,
ThunkConfig<string>>(
  'common/loginByUsername',
  async (authData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
      dispatch
    } = thunkAPI
    try {
      const response = await extra.api.post<string>('/auth/login', authData)
      if (!response.data) {
        throw new Error()
      }
      // localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(response.data))
      localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, response.data)
      dispatch(userActions.setToken(response.data))
      return response.data
    } catch (e) {
      return rejectWithValue('error')
    }
  }
)
