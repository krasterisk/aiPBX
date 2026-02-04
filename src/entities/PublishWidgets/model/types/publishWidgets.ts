import { WidgetKey } from '@/entities/WidgetKeys'

export interface PublishWidgetsPageSchema {
    isLoading?: boolean
    error?: string
    page: number
    limit: number
    hasMore: boolean
    search: string
    clientId?: string
    _inited: boolean
}

export interface PublishWidgetsListProps {
    className?: string
    isWidgetsLoading?: boolean
    isWidgetsError?: boolean
    widgets?: {
        count: number
        rows: WidgetKey[]
    }
}
