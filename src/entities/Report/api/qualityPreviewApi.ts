import { rtkApi } from '@/shared/api/rtkApi'
import type { AllReports, MetricOverrideInput, OperatorCdrResponse, OperatorDashboardResponse, OperatorEvidenceResponse } from '../model/types/report'
import type { DashboardInsightsResponse } from '../model/types/dashboardInsights'
import type { JournalQuery } from './journalApi'
import type { reportApi } from './reportApi'
import { applyProjectQuery } from './reportApi'

const qualityParams = ({ projectId, ...rest }: { projectId?: string, [key: string]: unknown }) =>
    Object.fromEntries(Object.entries({ ...rest, ...applyProjectQuery(projectId) }).filter(([, value]) => value !== undefined && value !== ''))

export const qualityPreviewApi = rtkApi.injectEndpoints({
 endpoints: build => ({
    qualityInsights: build.query<DashboardInsightsResponse, Parameters<typeof reportApi.endpoints.getOperatorDashboard.initiate>[0] & { refresh?: boolean, timezone?: string }>({
        query: params => ({ url: '/quality-preview/insights', params: qualityParams({ ...params, refresh: params.refresh ? '1' : undefined }) }),
        keepUnusedDataFor: 0
    }),
    qualityDashboard: build.query<OperatorDashboardResponse, Parameters<typeof reportApi.endpoints.getOperatorDashboard.initiate>[0]>({
        query: params => ({ url: '/quality-preview/dashboard', params: qualityParams(params) }),
        providesTags: [{ type: 'OperatorAnalytics', id: 'QUALITY-PREVIEW' }]
    }),
    qualityCdrs: build.query<OperatorCdrResponse, Parameters<typeof reportApi.endpoints.getOperatorCdrs.initiate>[0]>({
        query: params => ({ url: '/quality-preview/cdrs', params: qualityParams(params) }),
        providesTags: [{ type: 'OperatorAnalytics', id: 'QUALITY-PREVIEW' }]
    }),
    qualityEvidence: build.query<OperatorEvidenceResponse, Parameters<typeof reportApi.endpoints.getOperatorEvidence.initiate>[0]>({
        query: params => ({ url: '/quality-preview/operator-evidence', params: qualityParams(params) }),
        providesTags: [{ type: 'OperatorAnalytics', id: 'QUALITY-PREVIEW' }]
    }),
    qualityJournal: build.query<AllReports, JournalQuery>({
        query: params => ({ url: '/reports/quality-preview', params }),
        keepUnusedDataFor: 10,
        providesTags: [{ type: 'OperatorAnalytics', id: 'QUALITY-PREVIEW' }]
    }),
    regenerateCallFree: build.mutation<unknown, { channelId: string, operator: boolean }>({
        query: ({ channelId, operator }) => ({ url: `/${operator ? 'operator-analytics' : 'ai-analytics'}/regenerate-free/${encodeURIComponent(channelId)}`, method: 'POST' }),
        invalidatesTags: (_data, _error, { channelId }) => [{ type: 'OperatorAnalytics', id: `QUALITY-PREVIEW-CALL-${channelId}` }, { type: 'OperatorAnalytics', id: 'QUALITY-PREVIEW' }, { type: 'Reports', id: 'LIST' }]
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
export const { useRegenerateCallFreeMutation, useAnalyzeQualityPreviewMutation, useQualityJournalQuery, useLazyQualityJournalQuery, useSaveQualityPreviewOverridesMutation, useDeleteQualityPreviewOverrideMutation } = qualityPreviewApi
export const { useLazyQualityInsightsQuery, useQualityDashboardQuery, useQualityCdrsQuery, useLazyQualityCdrsQuery, useQualityEvidenceQuery } = qualityPreviewApi
