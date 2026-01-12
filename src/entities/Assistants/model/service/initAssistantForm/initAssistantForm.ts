import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'
import { assistantFormActions } from '../../slices/assistantFormSlice'

export const initAssistantsForm = createAsyncThunk<
void | never,
void | never,
ThunkConfig<string>>(
  'AssistantsPage/initAssistantsForm',
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI
    dispatch(assistantFormActions.resetForm())
  }
)
