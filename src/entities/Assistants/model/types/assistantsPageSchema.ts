import { ContentView } from '../../../Content'
import { Assistant } from './assistants'
import { ClientOptions } from '@/entities/User'

export interface AssistantsPageSchema {
  // pagination
  page: number
  limit: number
  hasMore: boolean
  // filters
  view: ContentView
  _inited?: boolean
  refreshOnFocus?: boolean
  search: string
  createForm: Assistant
  editForm: Assistant
  userId: string
  user?: ClientOptions
}
