import { StateSchema } from '@/app/providers/StoreProvider'
import { createSelector } from '@reduxjs/toolkit'

export const getScrollSave = (state: StateSchema) => state.saveScroll.scroll
export const getScrollRestorationEnabled = (state: StateSchema) => state.saveScroll.isRestorationEnabled
export const getScrollByPath = createSelector(
  getScrollSave,
  (state: StateSchema, path: string) => path,
  (scroll, path) => scroll[path] || 0
)
