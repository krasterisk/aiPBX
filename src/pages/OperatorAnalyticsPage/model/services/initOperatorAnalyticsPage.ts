import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'
import { operatorAnalyticsPageActions } from '../slices/operatorAnalyticsPageSlice'
import { getOperatorAnalyticsInited } from '../selectors/operatorAnalyticsPageSelectors'

export const initOperatorAnalyticsPage = createAsyncThunk<
    void | never,
    void | never,
    ThunkConfig<string>>(
        'OperatorAnalyticsPage/initOperatorAnalyticsPage',
        async (_, thunkAPI) => {
            const { getState, dispatch } = thunkAPI
            const inited = getOperatorAnalyticsInited(getState())
            if (!inited) {
                dispatch(operatorAnalyticsPageActions.initState())
            }
        }
    )
