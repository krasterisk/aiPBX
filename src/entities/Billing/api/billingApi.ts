import { rtkApi } from '@/shared/api/rtkApi'

export interface BillingRecord {
    id: number
    channelId: string
    type: string
    userId: string | null
    description: string | null
    audioTokens: number
    textTokens: number
    totalTokens: number
    audioCost: number
    textCost: number
    sttCost: number
    totalCost: number
    createdAt: string
    updatedAt: string
    aiCdr: {
        channelId: string
        assistantName: string | null
        callerId: string | null
        source: string | null
        duration: number | null
    } | null
}

export interface BillingResponse {
    rows: BillingRecord[]
    count: number
    totalCost: number
    page: number
    limit: number
}

export interface BillingQueryParams {
    page?: number
    limit?: number
    startDate?: string
    endDate?: string
    type?: string
    userId?: string
    sortField?: string
    sortOrder?: string
}

const billingApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getBillingHistory: build.query<BillingResponse, BillingQueryParams>({
            query: (params) => {
                const query = new URLSearchParams()
                if (params.page) query.set('page', String(params.page))
                if (params.limit) query.set('limit', String(params.limit))
                if (params.startDate) query.set('startDate', params.startDate)
                if (params.endDate) query.set('endDate', params.endDate)
                if (params.type) query.set('type', params.type)
                if (params.userId) query.set('userId', params.userId)
                if (params.sortField) query.set('sortField', params.sortField)
                if (params.sortOrder) query.set('sortOrder', params.sortOrder)
                return `/billing?${query.toString()}`
            },
            providesTags: ['Billing'],
        }),
    }),
})

export const useBillingHistory = billingApi.useGetBillingHistoryQuery
