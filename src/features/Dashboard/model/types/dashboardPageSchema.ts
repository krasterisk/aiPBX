import { AssistantOptions } from '@/entities/Assistants'
import { ClientOptions } from '@/entities/User'

export interface DashboardPageSchema {
    tab?: string
    startDate?: string
    endDate?: string
    _inited?: boolean
    assistantId?: string[]
    assistants?: AssistantOptions[]
    userId: string
    user?: ClientOptions
}
