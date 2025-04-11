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
  parameters?: object[]
  strict?: boolean
  user?: User
  userId?: string
  comment?: string
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
