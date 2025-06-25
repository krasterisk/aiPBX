import { ContentView } from '@/entities/Content'
import { ClientOptions } from '@/entities/User'
import { AssistantOptions } from '@/entities/Assistants'

export interface ReportsPageSchema {
  // pagination
  page: number
  limit: number
  hasMore: boolean
  // filters
  tab?: string
  assistantId?: string[]
  assistants?: AssistantOptions[]
  startDate?: string
  endDate?: string
  view: ContentView
  _inited?: boolean
  refreshOnFocus?: boolean
  search: string
  userId: string
  user?: ClientOptions
}
