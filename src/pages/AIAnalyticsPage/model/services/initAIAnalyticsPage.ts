import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'
import { aiAnalyticsPageActions } from '../slices/aiAnalyticsPageSlice'
import { getAIAnalyticsInited } from '../selectors/aiAnalyticsPageSelectors'

export const initAIAnalyticsPage = createAsyncThunk<
    void | never,
    void | never,
    ThunkConfig<string>>(
        'AIAnalyticsPage/initAIAnalyticsPage',
        async (_, thunkAPI) => {
            const { getState, dispatch } = thunkAPI
            const inited = getAIAnalyticsInited(getState())
            if (!inited) {
                dispatch(aiAnalyticsPageActions.initState())
            }
        }
    )
