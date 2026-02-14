import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'
import { mcpServersPageActions } from '../../slices/mcpServersPageSlice'
import { getMcpServersInited } from '../../selectors/mcpServersPageSelectors'

export const initMcpServersPage = createAsyncThunk<
    void | never,
    void | never,
    ThunkConfig<string>>(
        'entities/initMcpServersPage',
        async (_, thunkAPI) => {
            const { getState, dispatch } = thunkAPI
            const inited = getMcpServersInited(getState())
            if (!inited) {
                dispatch(mcpServersPageActions.initState())
            }
        }
    )
