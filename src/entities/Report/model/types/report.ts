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
  event: object
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
