import { User } from '@/entities/User'
import { HTMLAttributeAnchorTarget } from 'react'

export interface AllPbxServers {
  count: number
  rows: PbxServer[]
}

export interface PbxServerOptions {
  id: string
  uniqueId?: string
  name: string
  location?: string
  wss_url?: string
  sip_host?: string
}

export interface PbxServer {
  id?: string
  uniqueId?: string
  name?: string
  location?: string
  sip_host?: string
  wss_url?: string
  ari_url?: string
  ari_user?: string
  password?: string
  comment?: string
  user?: User
  userId?: string
  cloudPbx?: boolean
  context?: string
  moh?: string
  recordFormat?: string
}

export interface PbxServerListProps {
  className?: string
  target?: HTMLAttributeAnchorTarget
  isPbxServersLoading?: boolean
  isPbxServersError?: boolean
  pbxServers?: AllPbxServers
  onDelete?: (id: string) => void
}
