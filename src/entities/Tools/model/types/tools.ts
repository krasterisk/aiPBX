import { User } from '../../../User'
import { HTMLAttributeAnchorTarget } from 'react'
import { ContentView } from '@/entities/Content'

export interface AllTools {
  count: number
  rows: Tool[]
}

export interface Tool {
  id?: string
  name?: string
  type?: string
  description?: string
  parameters?: ToolParameters
  strict?: boolean
  webhook?: string
  user?: User
  userId?: string
  comment?: string
}

export interface ToolParameters {
  type: string
  properties: Record<string, ToolParam>
  required?: string[]
}

export interface ToolParam {
  type: string
  description?: string
  enum?: string[]
  required?: boolean
}

export interface ToolsListProps {
  className?: string
  target?: HTMLAttributeAnchorTarget
  isToolsLoading?: boolean
  isToolsError?: boolean
  view?: ContentView
  tools?: AllTools
  onDelete?: (id: string) => void
}
