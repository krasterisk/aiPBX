import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'
import { assistantsPageActions } from '../../../model/slices/assistantsPageSlice'
import { getAssistantsInited } from '../../selectors/assistantsPageSelectors'

export const initAssistantsPage = createAsyncThunk<
void | never,
void | never,
ThunkConfig<string>>(
  'AssistantsPage/initAssistantsPage',
  async (_, thunkAPI) => {
    const { getState, dispatch } = thunkAPI
    const inited = getAssistantsInited(getState())
    if (!inited) {
      dispatch(assistantsPageActions.initState())
    }
  }
)
