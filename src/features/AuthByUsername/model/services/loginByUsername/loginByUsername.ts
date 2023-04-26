import { User, userActions } from '@/entities/User'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { USER_LOCALSTORAGE_KEY } from '@/shared/const/localstorage'
import { ThunkConfig } from '@/app/providers/StoreProvider'

interface loginByUsernameProps {
    username: string
    password: string
}

export const loginByUsername = createAsyncThunk<
User,
loginByUsernameProps,
ThunkConfig<string>>(
    'login/loginByUsername',
    async (authData, thunkAPI) => {
        const {
            extra,
            rejectWithValue,
            dispatch
        } = thunkAPI

        try {
            console.log(authData)
            const response = await extra.api.post<User>('/auth/login', authData)
            if (!response.data) {
                throw new Error()
            }
            localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(response.data))
            //            localStorage.setItem(TOKEN_LOCALSTORAGE_KEY, JSON.stringify(response.data.token))
            dispatch(userActions.setAuthData(response.data))
            return response.data
        } catch (e) {
            return rejectWithValue('error')
        }
    }
)
