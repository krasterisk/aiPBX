import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'

import { toolsPageActions } from '../../slices/toolsPageSlice'
import {
  getToolsHasMore,
  getToolsPageNum
} from '../../selectors/toolsPageSelectors'

export const fetchNextToolsPage = createAsyncThunk<
void | never,
void | never,
ThunkConfig<string>
>(
  'ToolsPage/fetchNextToolsList',
  async (_, thunkAPI) => {
    const { dispatch, getState } = thunkAPI
    const hasMore = getToolsHasMore(getState())
    const page = getToolsPageNum(getState())

    if (hasMore) {
      dispatch(toolsPageActions.setPage(page + 1))
    }
  }
)
