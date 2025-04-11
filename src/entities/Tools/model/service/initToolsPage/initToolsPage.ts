import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'
import { toolsPageActions } from '../../slices/toolsPageSlice'
import { getToolsInited } from '../../selectors/toolsPageSelectors'

export const initToolsPage = createAsyncThunk<
void | never,
void | never,
ThunkConfig<string>>(
  'entities/initToolsPage',
  async (_, thunkAPI) => {
    const { getState, dispatch } = thunkAPI
    const inited = getToolsInited(getState())
    if (!inited) {
      dispatch(toolsPageActions.initState())
    }
  }
)
