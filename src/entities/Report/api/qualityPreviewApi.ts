import { rtkApi } from '@/shared/api/rtkApi'
import type { AllReports, MetricOverrideInput } from '../model/types/report'
import type { JournalQuery } from './journalApi'

export const qualityPreviewApi = rtkApi.injectEndpoints({
 endpoints: build => ({
    qualityJournal: build.query<AllReports, JournalQuery>({
        query: params => ({ url: '/reports/quality-preview', params }),
        keepUnusedDataFor: 10,
        providesTags: [{ type: 'OperatorAnalytics', id: 'QUALITY-PREVIEW' }]
    }),
    analyzeQualityPreview: build.mutation<unknown, string>({
        query: channelId => ({ url: `/quality-preview/calls/${encodeURIComponent(channelId)}/analyze`, method: 'POST' }),
        invalidatesTags: (_data, _error, channelId) => [{ type: 'OperatorAnalytics', id: `QUALITY-PREVIEW-CALL-${channelId}` }, { type: 'OperatorAnalytics', id: 'QUALITY-PREVIEW' }]
    }),
    saveQualityPreviewOverrides: build.mutation<unknown, { channelId: string, overrides: MetricOverrideInput[] }>({
        query: ({ channelId, overrides }) => ({ url: `/quality-preview/calls/${encodeURIComponent(channelId)}/overrides`, method: 'POST', body: { overrides } }),
        invalidatesTags: (_data, _error, { channelId }) => [{ type: 'OperatorAnalytics', id: `QUALITY-PREVIEW-CALL-${channelId}` }, { type: 'OperatorAnalytics', id: 'QUALITY-PREVIEW' }]
    }),
    deleteQualityPreviewOverride: build.mutation<unknown, { channelId: string, metricId: string }>({
        query: ({ channelId, metricId }) => ({ url: `/quality-preview/calls/${encodeURIComponent(channelId)}/overrides/${encodeURIComponent(metricId)}`, method: 'DELETE' }),
        invalidatesTags: (_data, _error, { channelId }) => [{ type: 'OperatorAnalytics', id: `QUALITY-PREVIEW-CALL-${channelId}` }, { type: 'OperatorAnalytics', id: 'QUALITY-PREVIEW' }]
    })
})
})
export const { useAnalyzeQualityPreviewMutation, useQualityJournalQuery, useLazyQualityJournalQuery, useSaveQualityPreviewOverridesMutation, useDeleteQualityPreviewOverrideMutation } = qualityPreviewApi
