import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ScrollSaveSchema } from '../types/scrollSaveSchema'

const initialState: ScrollSaveSchema = {
  scroll: {},
  isRestorationEnabled: false
}

export const ScrollSaveSlice = createSlice({
  name: 'ScrollSave',
  initialState,
  reducers: {
    setScrollPosition: (state, { payload }: PayloadAction<{ path: string, position: number }>) => {
      state.scroll[payload.path] = payload.position
    },
    setRestoration: (state, { payload }: PayloadAction<boolean>) => {
      state.isRestorationEnabled = payload
    }
  }
})

export const { actions: scrollSaveActions } = ScrollSaveSlice
export const { reducer: scrollSaveReducer } = ScrollSaveSlice
