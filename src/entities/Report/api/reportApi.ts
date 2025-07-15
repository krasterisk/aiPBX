import { rtkApi } from '@/shared/api/rtkApi'
import { AllReports, Report, ReportDialog } from '../model/types/report'

interface QueryArgs {
  page?: number
  limit?: number
  search?: string
  tab?: string
  assistantId?: string[]
  startDate?: string
  endDate?: string
  userId?: string
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
      forceRefetch ({ currentArg, previousArg }) {
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
      query: (args) => ({
        url: '/reports/dashboard',
        params: args
      })
    }),
    updateReport: build.mutation<Report, Pick<Report, 'id'> & Partial<Report>>({
      query: ({ id, ...patch }) => ({
        url: '/reports',
        method: 'PATCH',
        body: { id, ...patch }
      }),
      async onQueryStarted ({ id, ...patch }, { dispatch, queryFulfilled }) {
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
      query (id) {
        return {
          url: `/reports/${id}`,
          method: 'DELETE'
        }
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      invalidatesTags: (result, error, id) => [{ type: 'Reports', id }]
    })
  })
})

export const useGetReportDialogs = reportApi.useGetReportDialogsQuery
export const useGetReportEvents = reportApi.useGetReportEventsQuery
export const useDashboard = reportApi.useGetReportDashboardQuery
export const useGetReports = reportApi.useGetReportsQuery
export const useGetAllReports = reportApi.useGetAllReportsQuery
export const useSetReports = reportApi.useSetReportsMutation
export const useGetReport = reportApi.useGetReportQuery
export const useUpdateReport = reportApi.useUpdateReportMutation
export const useDeleteReport = reportApi.useDeleteReportMutation
