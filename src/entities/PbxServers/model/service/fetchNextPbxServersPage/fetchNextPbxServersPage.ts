import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'

import { pbxServersPageActions } from '../../slices/pbxServersPageSlice'
import {
  getPbxServersHasMore,
  getPbxServersPageNum
} from '../../selectors/pbxServersPageSelectors'

export const fetchNextPbxServersPage = createAsyncThunk<
void | never,
void | never,
ThunkConfig<string>
>(
  'PbxServersPage/fetchNextPbxServersList',
  async (_, thunkAPI) => {
    const { dispatch, getState } = thunkAPI
    const hasMore = getPbxServersHasMore(getState())
    const page = getPbxServersPageNum(getState())

    if (hasMore) {
      dispatch(pbxServersPageActions.setPage(page + 1))
    }
  }
)
