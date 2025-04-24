import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'
import { reportsPageActions } from '../../slices/reportsPageSlice'
import {
  getReportsHasMore,
  getReportsPageNum
} from '../../selectors/reportSelectors'

export const fetchNextReportsPage = createAsyncThunk<
void | never,
void | never,
ThunkConfig<string>
>(
  'ReportsPage/fetchNextReportsList',
  async (_, thunkAPI) => {
    const { dispatch, getState } = thunkAPI
    const hasMore = getReportsHasMore(getState())
    const page = getReportsPageNum(getState())

    if (hasMore) {
      dispatch(reportsPageActions.setPage(page + 1))
    }
  }
)
