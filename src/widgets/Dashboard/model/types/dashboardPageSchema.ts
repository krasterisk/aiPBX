import { AssistantOptions } from '@/entities/Assistants'
import { ClientOptions } from '@/entities/User'

export type DashboardTab = 'overview' | 'ai-analytics' | 'call-records'

export interface DashboardPageSchema {
  tab?: string
  activeTab?: DashboardTab
  startDate?: string
  endDate?: string
  _inited?: boolean
  assistantId?: string[]
  assistants?: AssistantOptions[]
  userId: string
  user?: ClientOptions
}
