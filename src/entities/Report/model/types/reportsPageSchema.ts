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
  _inited?: boolean
  refreshOnFocus?: boolean
  search: string
  userId: string
  user?: ClientOptions
  // sorting
  sortField?: string
  sortOrder?: 'ASC' | 'DESC'
}
