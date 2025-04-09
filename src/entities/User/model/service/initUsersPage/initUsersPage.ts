import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'
import { getUsersInited } from '../../selectors/usersPageSelectors'
import { usersPageActions } from '../../slice/usersPageSlice'

export const initUsersPage = createAsyncThunk<
void | never,
void | never,
ThunkConfig<string>>(
  'UsersPage/initUsersPage',
  async (_, thunkAPI) => {
    const { getState, dispatch } = thunkAPI
    const inited = getUsersInited(getState())
    if (!inited) {
      dispatch(usersPageActions.initState())
    }
  }
)
