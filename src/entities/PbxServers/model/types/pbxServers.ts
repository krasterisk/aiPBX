import { User } from '@/entities/User'
import { HTMLAttributeAnchorTarget } from 'react'
import { AllTools } from '@/entities/Tools'

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
}

export interface PbxServerListProps {
  className?: string
  target?: HTMLAttributeAnchorTarget
  isPbxServersLoading?: boolean
  isPbxServersError?: boolean
  pbxServers?: AllPbxServers
  onDelete?: (id: string) => void
}
