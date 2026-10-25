import { rtkApi } from '@/shared/api/rtkApi'
import type { AllReports } from '../model/types/report'

export interface JournalQuery {
    page: number
    limit: number
    search: string
    startDate: string
    endDate: string
    userId?: string
    sources?: string
    callTypes?: string
    people?: string
    csat?: string
    tagId?: string
    projectId?: string
    sortField: string
    sortOrder: 'ASC' | 'DESC'
}
export interface JournalPersonOption { value: string, label: string }

export const journalApi = rtkApi.injectEndpoints({
    endpoints: build => ({
        getCallJournal: build.query<AllReports, JournalQuery>({
            query: params => ({ url: '/reports/journal', params }),
            // Page remains part of the key: old infinite-scroll cache is not shared.
            keepUnusedDataFor: 10,
            providesTags: result => [
                { type: 'Reports', id: 'LIST' },
                { type: 'OperatorAnalytics', id: 'LIST' },
                ...(result?.rows ?? []).flatMap(row => [
                    { type: 'Reports' as const, id: row.id },
                    { type: 'OperatorAnalytics' as const, id: row.channelId }
                ])
            ]
        }),
        getCallJournalOptions: build.query<{ people: JournalPersonOption[], limitReached: boolean }, Pick<JournalQuery, 'startDate' | 'endDate' | 'userId'>>({
            query: params => ({ url: '/reports/journal/options', params }),
            providesTags: [{ type: 'Reports', id: 'LIST' }]
        })
    })
})

export const { useGetCallJournalQuery, useLazyGetCallJournalQuery, useGetCallJournalOptionsQuery } = journalApi
