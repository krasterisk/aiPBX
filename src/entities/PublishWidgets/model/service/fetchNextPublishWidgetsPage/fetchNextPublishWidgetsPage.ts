import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'
import { getPublishWidgetsPagePage, getPublishWidgetsPageLimit } from '../../selectors/publishWidgetsPageSelectors'

export const fetchNextPublishWidgetsPage = createAsyncThunk<
    { hasMore: boolean, page: number },
    void,
    ThunkConfig<string>
>(
    'publishWidgetsPage/fetchNextPublishWidgetsPage',
    async (_, thunkAPI) => {
        const { getState } = thunkAPI
        const page = getPublishWidgetsPagePage(getState())
        const limit = getPublishWidgetsPageLimit(getState())

        // In this case we're using RTK Query hook in component, 
        // so this thunk just tracks pagination state
        return {
            hasMore: true,
            page: page + 1
        }
    }
)
