import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'
import { dashboardPageActions } from '../slices/dashboardPageSlice'
import { getDashboardInited } from '../selectors/dashboardPageSelectors'

export const initDashboardPage = createAsyncThunk<
void | never,
void | never,
ThunkConfig<string>>(
  'DashboardPage/initDashboardPage',
  async (_, thunkAPI) => {
    const { getState, dispatch } = thunkAPI
    const inited = getDashboardInited(getState())
    if (!inited) {
      dispatch(dashboardPageActions.initState())
    }
  }
)
