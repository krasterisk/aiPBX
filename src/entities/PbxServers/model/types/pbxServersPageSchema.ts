import { ContentView } from '../../../Content'
import { PbxServer } from './pbxServers'
import { ClientOptions } from '@/entities/User'

export interface PbxServersPageSchema {
  // pagination
  page: number
  limit: number
  hasMore: boolean
  // filters
  view: ContentView
  _inited?: boolean
  refreshOnFocus?: boolean
  search: string
  createForm: PbxServer
  editForm: PbxServer
  userId?: string
  user?: ClientOptions
}
