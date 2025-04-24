import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'
import { getReportsInited } from '../../selectors/reportSelectors'
import { reportsPageActions } from '../../slices/reportsPageSlice'

export const initReportsPage = createAsyncThunk<
void | never,
void | never,
ThunkConfig<string>>(
  'ReportsPage/initReportsPage',
  async (_, thunkAPI) => {
    const { getState, dispatch } = thunkAPI
    const inited = getReportsInited(getState())
    if (!inited) {
      dispatch(reportsPageActions.initState())
    }
  }
)
