import { ContentView } from '../../../Content'
import { SortOrder } from '@/shared/types/sort'
import { UserSortField } from '../consts/consts'

export interface UsersPageSchema {
  // pagination
  page: number
  limit: number
  hasMore: boolean
  // filters
  view: ContentView
  _inited?: boolean
  tab: string
  order: SortOrder
  sort: UserSortField
  search: string
}
