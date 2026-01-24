import { StateSchema } from '@/app/providers/StoreProvider'
import { UserSortField } from '../consts/consts'

export const getUsersPageView = (state: StateSchema) => 'BIG'
export const getUsersPageNum = (state: StateSchema) => state.usersPage?.page || 1
export const getUsersPageLimit = (state: StateSchema) => state.usersPage?.limit || 25
export const getUsersHasMore = (state: StateSchema) => state.usersPage?.hasMore
export const getUsersInited = (state: StateSchema) => state.usersPage?._inited
export const getUsersPageOrder = (state: StateSchema) => state.usersPage?.order ?? 'asc'
export const getUsersTab = (state: StateSchema) => state.usersPage?.tab ?? ''
export const getUsersPageSort = (state: StateSchema) => state.usersPage?.sort ?? UserSortField.NAME
export const getUsersPageSearch = (state: StateSchema) => state.usersPage?.search ?? ''
