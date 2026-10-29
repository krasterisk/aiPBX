import { rtkApi } from '@/shared/api/rtkApi'
import type { QualityConfig, QualityDetail, QualityHistoryItem, QualityRulesResponse } from '../model/types/quality'

export const qualityApi = rtkApi.injectEndpoints({
    endpoints: build => ({
        getQualityDetail: build.query<QualityDetail, { channelId: string, runId?: string }>({
            query: ({ channelId, runId }) => ({ url: `/quality-preview/calls/${encodeURIComponent(channelId)}`, params: { runId } }),
            async onQueryStarted({ runId }, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    // Current detail may publish a corrected projection. Refresh all its readers.
                    if (!runId) dispatch(rtkApi.util.invalidateTags([{ type: 'OperatorAnalytics', id: 'QUALITY-PREVIEW' }]))
                } catch { /* Failed and historical reads cannot change the current projection. */ }
            },
            providesTags: (_result, _error, arg) => [{ type: 'OperatorAnalytics', id: `QUALITY-PREVIEW-CALL-${arg.channelId}` }]
        }),
        getQualityHistory: build.query<QualityHistoryItem[], { channelId: string, before?: string }>({
            query: ({ channelId, before }) => ({ url: `/quality-preview/calls/${encodeURIComponent(channelId)}/history`, params: { before, limit: 20 } }),
            providesTags: (_result, _error, arg) => [{ type: 'OperatorAnalytics', id: `QUALITY-PREVIEW-CALL-${arg.channelId}` }]
        }),
        getQualityRules: build.query<QualityRulesResponse, number>({
            query: id => `/quality-preview/projects/${id}/rules`,
            providesTags: (_result, _error, id) => [{ type: 'OperatorAnalytics', id: `quality-project-${id}` }]
        }),
        saveQualityRules: build.mutation<QualityRulesResponse, { id: number, config: QualityConfig }>({
            query: ({ id, config }) => ({ url: `/quality-preview/projects/${id}/rules`, method: 'PATCH', body: config }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'OperatorAnalytics', id: `quality-project-${id}` }]
        })
    })
})
export const { useGetQualityDetailQuery, useGetQualityHistoryQuery, useGetQualityRulesQuery, useSaveQualityRulesMutation } = qualityApi
