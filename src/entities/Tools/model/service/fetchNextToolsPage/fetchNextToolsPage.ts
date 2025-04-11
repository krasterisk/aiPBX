import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'

import { assistantsPageActions } from '../../slices/toolsPageSlice'
import {
  getAssistantsHasMore,
  getAssistantsPageNum
} from '../../selectors/toolsPageSelectors'

export const fetchNextToolsPage = createAsyncThunk<
void | never,
void | never,
ThunkConfig<string>
>(
  'AssistantsPage/fetchNextAssistantsList',
  async (_, thunkAPI) => {
    const { dispatch, getState } = thunkAPI
    const hasMore = getAssistantsHasMore(getState())
    const page = getAssistantsPageNum(getState())

    if (hasMore) {
      dispatch(assistantsPageActions.setPage(page + 1))
    }
  }
)
