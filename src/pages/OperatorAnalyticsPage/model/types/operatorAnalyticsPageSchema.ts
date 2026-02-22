export type PeriodTab = 'day' | 'week' | 'month' | 'year' | 'custom'
export type OverviewTab = 'dashboard' | 'cdr' | 'projects' | 'tokens'
export type SortableField = 'createdAt' | 'operatorName' | 'projectId' | 'duration'
    | 'customer_sentiment' | 'status' | 'average_score'

export interface OperatorAnalyticsPageSchema {
    periodTab: PeriodTab
    overviewTab: OverviewTab
    startDate: string
    endDate: string
    operatorName: string
    projectId: string
    page: number
    search: string
    sortField: SortableField
    sortOrder: 'ASC' | 'DESC'
    _inited: boolean
}
