import { createAsyncThunk } from '@reduxjs/toolkit'
import { ThunkConfig } from '@/app/providers/StoreProvider'
import { pbxServersPageActions } from '../../slices/pbxServersPageSlice'
import { getPbxServersInited } from '../../selectors/pbxServersPageSelectors'

export const initNextPbxServerPage = createAsyncThunk<
void | never,
void | never,
ThunkConfig<string>>(
  'entities/initNextPbxServerPage',
  async (_, thunkAPI) => {
    const { getState, dispatch } = thunkAPI
    const inited = getPbxServersInited(getState())
    if (!inited) {
      dispatch(pbxServersPageActions.initState())
    }
  }
)
