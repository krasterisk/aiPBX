import { ContentView } from '../../../Content'
import { Tool } from './tools'
import { ClientOptions } from '@/entities/User'

export interface ToolsPageSchema {
  // pagination
  page: number
  limit: number
  hasMore: boolean
  // filters
  view: ContentView
  _inited?: boolean
  refreshOnFocus?: boolean
  search: string
  createForm: Tool
  editForm: Tool
  userId: string
  user?: ClientOptions
}
