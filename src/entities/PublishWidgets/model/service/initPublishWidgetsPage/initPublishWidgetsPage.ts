import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'
import { getPublishWidgetsPageInited } from '../../selectors/publishWidgetsPageSelectors'
import { publishWidgetsPageActions } from '../../slices/publishWidgetsPageSlice'
import { fetchNextPublishWidgetsPage } from '../fetchNextPublishWidgetsPage/fetchNextPublishWidgetsPage'

export const initPublishWidgetsPage = createAsyncThunk<
    void,
    void,
    ThunkConfig<string>
>(
    'publishWidgetsPage/initPublishWidgetsPage',
    async (_, thunkAPI) => {
        const { getState, dispatch } = thunkAPI
        const inited = getPublishWidgetsPageInited(getState())
        if (!inited) {
            dispatch(publishWidgetsPageActions.setInited())
            dispatch(publishWidgetsPageActions.setPage(1))
            dispatch(fetchNextPublishWidgetsPage())
        }
    }
)
