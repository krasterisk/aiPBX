import { HTMLAttributeAnchorTarget } from 'react'

export interface AllReports {
  count: number
  totalCost: number
  rows: Report[]
}

export interface Report {
  id: string
  callerId: string
  channelId: string
  assistantName?: string
  assistantId?: string
  tokens?: number
  cost?: number
  duration?: number
  recordUrl?: string
  events?: ReportEvent[]
  createdAt: string
  userId: string
}

export interface ReportsListProps {
  className?: string
  target?: HTMLAttributeAnchorTarget
  isReportsLoading?: boolean
  isReportsError?: boolean
  reports?: AllReports
}

export interface ReportFilters {
  userId?: string
  terminalId?: string | null
  tab?: string
  chartData?: ChartData[]
  allCount?: number
  allTokensCount?: number
  allDurationCount?: number
  allCost?: number
  startDate?: string | null
  endDate?: string | null
}

export interface ChartData {
  label?: string[]
  allCount?: number[]
  tokensCount?: number[]
  durationCount?: number[]
  amount?: number[]
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
  role: 'User' | 'Assistant' | 'Function' | 'Call' | 'Error' | 'System'
  text: string
}
