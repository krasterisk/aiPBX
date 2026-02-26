import { rtkApi } from '@/shared/api/rtkApi'
import { AIAnalyticsResponse, AllReports, Analytics, BatchUploadResponse, CdrSource, MetricDefinition, OperatorAnalysisResult, OperatorApiToken, OperatorCdrResponse, OperatorDashboardResponse, OperatorProject, Report, ReportDialog } from '../model/types/report'

interface QueryArgs {
  page?: number
  limit?: number
  search?: string
  tab?: string
  assistantId?: string[]
  startDate?: string
  endDate?: string
  userId?: string
  sortField?: string
  sortOrder?: 'ASC' | 'DESC'
  source?: CdrSource
}

interface AIAnalyticsDashboardArgs {
  userId?: string
  assistantId?: string[]
  startDate?: string
  endDate?: string
  source?: CdrSource
}

export const reportApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getReports: build.query<AllReports, QueryArgs>({
      query: (args) => ({
        url: '/reports/page',
        params: args
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems // Перезаписываем кэш новыми данными
        } else {
          currentCache.rows.push(...newItems.rows) // Добавляем новые элементы к кэшу
          return currentCache
        }
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return JSON.stringify(currentArg) !== JSON.stringify(previousArg)
      },
      providesTags: (result) =>
        result?.rows?.length
          ? [
            ...result.rows.map(({ id }) => ({ type: 'Reports', id } as const)),
            { type: 'Reports', id: 'LIST' }
          ]
          : [{ type: 'Reports', id: 'LIST' }]
    }),
    getAllReports: build.query<Report[], null>({
      query: () => ({
        url: '/reports'
      }),
      providesTags: (result) =>
        result?.length
          ? [
            ...result.map(({ id }) => ({ type: 'Reports', id } as const)),
            { type: 'Reports', id: 'LIST' }
          ]
          : [{ type: 'Reports', id: 'LIST' }]
    }),
    getReportEvents: build.query<Report[], string>({
      query: (channelId) => ({
        url: `/reports/events/${channelId}`
      }),
      providesTags: (result) =>
        result?.length
          ? [
            ...result.map(({ channelId }) => ({ type: 'Reports', channelId } as const)),
            { type: 'Reports', id: 'LIST' }
          ]
          : [{ type: 'Reports', id: 'LIST' }]
    }),
    getReportDialogs: build.query<ReportDialog[], string>({
      query: (channelId) => ({
        url: `/reports/dialogs/${channelId}`
      }),
      providesTags: (result) =>
        result?.length
          ? [
            ...result.map(({ channelId }) => ({ type: 'Reports', channelId } as const)),
            { type: 'Reports', id: 'LIST' }
          ]
          : [{ type: 'Reports', id: 'LIST' }]
    }),
    setReports: build.mutation<Report, Report>({
      query: (arg) => ({
        url: '/reports',
        method: 'POST',
        body: arg
      }),
      invalidatesTags: [{ type: 'Reports', id: 'LIST' }]
    }),
    getReport: build.query<Report, string>({
      query: (id) => `/reports/${id}`,
      providesTags: (result, error, id) => [{ type: 'Reports', id }]
    }),
    getReportDashboard: build.query<Report, QueryArgs>({
      query: (args) => {
        const params = Object.fromEntries(
          Object.entries(args).filter(([, v]) => v !== undefined && v !== '')
        )
        return {
          url: '/reports/dashboard',
          params
        }
      }
    }),
    updateReport: build.mutation<Report, Pick<Report, 'id'> & Partial<Report>>({
      query: ({ id, ...patch }) => ({
        url: '/reports',
        method: 'PATCH',
        body: { id, ...patch }
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          reportApi.util.updateQueryData('getReport', id, (draft) => {
            Object.assign(draft, patch)
          })
        )
        queryFulfilled.catch(patchResult.undo)
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Reports', id }]
    }),
    deleteReport: build.mutation<{ success: boolean, id: string }, string>({
      query(id) {
        return {
          url: `/reports/${id}`,
          method: 'DELETE'
        }
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      invalidatesTags: (result, error, id) => [{ type: 'Reports', id }]
    }),
    getAIAnalyticsDashboard: build.query<AIAnalyticsResponse, AIAnalyticsDashboardArgs>({
      query: (args) => {
        const params = Object.fromEntries(
          Object.entries({
            ...args,
            assistantId: args.assistantId?.length ? args.assistantId.join(',') : undefined
          }).filter(([, v]) => v !== undefined && v !== '')
        )
        return {
          url: '/ai-analytics/dashboard/data',
          params
        }
      },
      providesTags: ['AIAnalytics']
    }),
    createCallAnalytics: build.mutation<Analytics, string>({
      query: (channelId) => ({
        url: `/ai-analytics/${channelId}`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Reports', id: 'LIST' },
        ...((result && 'channelId' in result) ? [{ type: 'Reports' as const, channelId: result.channelId }] : [])
      ]
    }),

    // Operator Analytics
    uploadOperatorFiles: build.mutation<OperatorAnalysisResult | BatchUploadResponse, FormData>({
      query: (body) => ({
        url: '/operator-analytics/upload',
        method: 'POST',
        body
      }),
      invalidatesTags: ['OperatorAnalytics', 'Reports']
    }),
    getOperatorAnalysis: build.query<OperatorAnalysisResult, string>({
      query: (id) => `/operator-analytics/${id}`,
      providesTags: (result, error, id) => [{ type: 'OperatorAnalytics', id }]
    }),
    getOperatorCdrs: build.query<OperatorCdrResponse, {
      startDate?: string
      endDate?: string
      operatorName?: string
      projectId?: string
      page?: number
      limit?: number
      search?: string
      sortField?: string
      sortOrder?: 'ASC' | 'DESC'
    }>({
      query: (args) => ({
        url: '/operator-analytics/cdrs',
        params: Object.fromEntries(
          Object.entries(args).filter(([, v]) => v !== undefined && v !== '')
        )
      }),
      providesTags: ['OperatorAnalytics']
    }),
    getOperatorDashboard: build.query<OperatorDashboardResponse, {
      startDate?: string
      endDate?: string
      operatorName?: string
      projectId?: string
    }>({
      query: (args) => ({
        url: '/operator-analytics/dashboard',
        params: Object.fromEntries(
          Object.entries(args).filter(([, v]) => v !== undefined && v !== '')
        )
      }),
      providesTags: ['OperatorAnalytics']
    }),
    getOperatorProjects: build.query<OperatorProject[], void>({
      query: () => '/operator-analytics/projects',
      providesTags: ['OperatorProjects']
    }),
    createOperatorProject: build.mutation<OperatorProject, {
      name: string
      description?: string
      systemPrompt?: string
      customMetricsSchema?: MetricDefinition[]
      visibleDefaultMetrics?: string[]
      webhookUrl?: string
      webhookHeaders?: Record<string, string>
      webhookEvents?: string[]
    }>({
      query: (body) => ({
        url: '/operator-analytics/projects',
        method: 'POST',
        body
      }),
      invalidatesTags: ['OperatorProjects']
    }),
    deleteOperatorProject: build.mutation<void, string>({
      query: (id) => ({
        url: `/operator-analytics/projects/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['OperatorProjects']
    }),
    generateOperatorApiToken: build.mutation<{ token: string } & OperatorApiToken, { name: string; projectId?: string }>({
      query: (body) => ({
        url: '/operator-analytics/tokens/generate',  // POST /api/operator-analytics/tokens/generate
        method: 'POST',
        body
      }),
      invalidatesTags: ['OperatorApiTokens']
    }),
    listOperatorApiTokens: build.query<OperatorApiToken[], void>({
      query: () => '/operator-analytics/tokens',     // GET /api/operator-analytics/tokens
      providesTags: ['OperatorApiTokens']
    }),
    revokeOperatorApiToken: build.mutation<void, string>({
      query: (id) => ({
        url: `/operator-analytics/tokens/${id}/revoke`, // PATCH /api/operator-analytics/tokens/:id/revoke
        method: 'PATCH'
      }),
      invalidatesTags: ['OperatorApiTokens']
    }),
    deleteOperatorApiToken: build.mutation<void, string>({
      query: (id) => ({
        url: `/operator-analytics/tokens/${id}`,      // DELETE /api/operator-analytics/tokens/:id
        method: 'DELETE'
      }),
      invalidatesTags: ['OperatorApiTokens']
    }),
    updateOperatorProject: build.mutation<void, {
      id: string
      name: string
      description?: string
      systemPrompt?: string
      customMetricsSchema?: MetricDefinition[]
      visibleDefaultMetrics?: string[]
      webhookUrl?: string
      webhookHeaders?: Record<string, string>
      webhookEvents?: string[]
    }>({
      query: ({ id, ...body }) => ({
        url: `/operator-analytics/projects/${id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['OperatorProjects']
    }),
    generateMetricsFromPrompt: build.mutation<MetricDefinition[], { messages: { role: 'ai' | 'user'; text: string }[]; systemPrompt?: string }>({
      query: (body) => ({
        url: '/operator-analytics/projects/generate-schema',
        method: 'POST',
        body
      })
    })
  })
})

export const useGetReportDialogs = reportApi.useGetReportDialogsQuery
export const useGetReportEvents = reportApi.useGetReportEventsQuery
export const useDashboard = reportApi.useGetReportDashboardQuery
export const useGetAIAnalyticsDashboard = reportApi.useGetAIAnalyticsDashboardQuery
export const useGetReports = reportApi.useGetReportsQuery
export const useGetAllReports = reportApi.useGetAllReportsQuery
export const useSetReports = reportApi.useSetReportsMutation
export const useGetReport = reportApi.useGetReportQuery
export const useUpdateReport = reportApi.useUpdateReportMutation
export const useDeleteReport = reportApi.useDeleteReportMutation
export const useCreateCallAnalytics = reportApi.useCreateCallAnalyticsMutation

// Operator Analytics hooks
export const useUploadOperatorFiles = reportApi.useUploadOperatorFilesMutation
export const useGetOperatorAnalysis = reportApi.useGetOperatorAnalysisQuery
export const useGetOperatorCdrs = reportApi.useGetOperatorCdrsQuery
export const useGetOperatorDashboard = reportApi.useGetOperatorDashboardQuery
export const useGetOperatorProjects = reportApi.useGetOperatorProjectsQuery
export const useCreateOperatorProject = reportApi.useCreateOperatorProjectMutation
export const useDeleteOperatorProject = reportApi.useDeleteOperatorProjectMutation
export const useUpdateOperatorProject = reportApi.useUpdateOperatorProjectMutation
export const useGenerateMetricsFromPrompt = reportApi.useGenerateMetricsFromPromptMutation
export const useGenerateOperatorApiToken = reportApi.useGenerateOperatorApiTokenMutation
export const useListOperatorApiTokens = reportApi.useListOperatorApiTokensQuery
export const useRevokeOperatorApiToken = reportApi.useRevokeOperatorApiTokenMutation
export const useDeleteOperatorApiToken = reportApi.useDeleteOperatorApiTokenMutation
