import { ContentView } from '@/entities/Content'
import { ClientOptions } from '@/entities/User'

export interface ReportsPageSchema {
  // pagination
  page: number
  limit: number
  hasMore: boolean
  // filters
  view: ContentView
  _inited?: boolean
  refreshOnFocus?: boolean
  search: string
  userId: string
  user?: ClientOptions
}
