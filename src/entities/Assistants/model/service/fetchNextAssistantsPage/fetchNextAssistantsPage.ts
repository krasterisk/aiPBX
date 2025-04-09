import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'

import { assistantsPageActions } from '../../slices/assistantsPageSlice'
import {
  getAssistantsHasMore,
  getAssistantsPageNum
} from '../../selectors/assistantsPageSelectors'

export const fetchNextAssistantsPage = createAsyncThunk<
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
