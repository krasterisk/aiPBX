export type { ScrollSaveSchema } from './model/types/scrollSaveSchema'

export { getScrollByPath, getScrollRestorationEnabled } from './model/selectors/scrollSave'
export { scrollSaveReducer, scrollSaveActions } from './model/slice/scrollSaveSlice'
