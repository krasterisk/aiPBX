import { User } from '../../../User'
import { HTMLAttributeAnchorTarget } from 'react'
import { ContentView } from '@/entities/Content'

export interface AllAssistants {
  count: number
  rows: Assistant[]
}

export interface Assistant {
  id?: string
  userId?: string
  user?: User
  name?: string
  comment?: string
}

export interface AssistantsListProps {
  className?: string
  target?: HTMLAttributeAnchorTarget
  isAssistantsLoading?: boolean
  isAssistantsError?: boolean
  view?: ContentView
  assistants?: AllAssistants
  onDelete?: (id: string) => void
}

export interface ChartData {
  label?: string[]
  resCount?: number[]
  issueCount?: number[]
}
