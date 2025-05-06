import { HTMLAttributeAnchorTarget } from 'react'
import { ContentView } from '@/entities/Content'

export interface AllReports {
  count: number
  rows: Report[]
}

export interface Report {
  id: string
  callerId: string
  channelId: string
  assistantName?: string
  assistantId?: string
  tokens?: number
  duration?: number
  events?: ReportEvent[]
  createdAt: string
  userId: string
}

export interface ReportsListProps {
  className?: string
  target?: HTMLAttributeAnchorTarget
  isReportsLoading?: boolean
  isReportsError?: boolean
  view?: ContentView
  reports?: AllReports
}

export interface ReportEvent {
  channelId?: string
  callerId?: string
  type?: string
  event_id?: string
  timestamp?: string
  transcript?: string
  response?: {
    output?: any
    usage?: {
      total_tokens?: number
    }
  }
}

export interface ReportDialog {
  channelId: string
  timestamp: string
  role: 'User' | 'Assistant'
  text: string
}
