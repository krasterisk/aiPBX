import { StateSchema } from '@/app/providers/StoreProvider'
import { ManualHashtagsTypes, ManualSortField } from '@/entities/Manual'
import { buildSelector } from '@/shared/lib/store'

export const getManualsPageIsLoading = (state: StateSchema) => state.manualsPage?.isLoading || false
export const getManualsPageError = (state: StateSchema) => state.manualsPage?.error
export const getManualsPageView = (state: StateSchema) => state.manualsPage?.view || 'SMALL'
export const getManualsPageNum = (state: StateSchema) => state.manualsPage?.page || 1
export const getManualsPageLimit = (state: StateSchema) => state.manualsPage?.limit || 9
export const getManualsPageHasMore = (state: StateSchema) => state.manualsPage?.hasMore
export const getManualsPageInited = (state: StateSchema) => state.manualsPage?._inited
export const getManualsPageOrder = (state: StateSchema) => state.manualsPage?.order ?? 'asc'
export const getManualsPageSort = (state: StateSchema) => state.manualsPage?.sort ?? ManualSortField.CREATED
export const getManualsPageSearch = (state: StateSchema) => state.manualsPage?.search ?? ''
export const getManualsPageHashtag = (state: StateSchema) => state.manualsPage?.hashtag ?? ManualHashtagsTypes.ALL

export const [useManualItemById] = buildSelector(
  (state, id: string) => state.manualsPage?.entities[id]
)
