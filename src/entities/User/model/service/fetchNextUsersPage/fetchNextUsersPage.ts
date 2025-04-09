import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'
import { usersPageActions } from '../../slice/usersPageSlice'
import {
  getUsersHasMore,
  getUsersPageNum
} from '../../selectors/usersPageSelectors'

export const fetchNextUsersPage = createAsyncThunk<
void | never,
void | never,
ThunkConfig<string>
>(
  'UsersPage/fetchNextUsersList',
  async (_, thunkAPI) => {
    const { dispatch, getState } = thunkAPI
    const hasMore = getUsersHasMore(getState())
    const page = getUsersPageNum(getState())

    if (hasMore) {
      dispatch(usersPageActions.setPage(page + 1))
    }
  }
)
