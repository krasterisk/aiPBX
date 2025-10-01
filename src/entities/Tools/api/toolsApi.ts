import { rtkApi } from '@/shared/api/rtkApi'
import { Tool, AllTools } from '../model/types/tools'

export interface QueryArgs {
  page: number
  limit: number
  sort?: string
  order?: string
  search?: string
  userId?: string
}

export const toolsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getTools: build.query<AllTools, QueryArgs>({
      query: (args) => ({
        url: '/tools/page',
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
              ...result.rows.map(({ id }) => ({ type: 'Tools', id } as const)),
              { type: 'Tools', id: 'LIST' }
            ]
          : [{ type: 'Tools', id: 'LIST' }]
    }),
    getToolsAll: build.query<Tool[], null>({
      query: (args) => ({
        url: '/tools'
      }),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: 'Tools', id } as const)),
              { type: 'Tools', id: 'LIST' }
            ]
          : [{ type: 'Tools', id: 'LIST' }]
    }),
    getUserTools: build.query<Tool[], string>({
      query: (userId) => ({
        url: `/tools/user/${userId}`
      }),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: 'Tools', id } as const)),
              { type: 'Tools', id: 'LIST' }
            ]
          : [{ type: 'Tools', id: 'LIST' }]
    }),
    setTools: build.mutation<Tool[], Tool[]>({
      query: (arg) => ({
        url: '/tools',
        method: 'POST',
        body: arg
      }),
      invalidatesTags: [{ type: 'Tools', id: 'LIST' }]
    }),
    getTool: build.query<Tool, string>({
      query: (id) => `/tools/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tools', id }]
    }),
    updateTool: build.mutation<Tool, Pick<Tool, 'id'> & Partial<Tool>>({
      query: ({ id, ...patch }) => ({
        url: '/tools',
        method: 'PATCH',
        body: { id, ...patch }
      }),
      async onQueryStarted ({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          toolsApi.util.updateQueryData('getTool', id!, (draft) => {
            Object.assign(draft, patch)
          })
        )
        queryFulfilled.catch(patchResult.undo)
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Tools', id }]
    }),
    deleteTool: build.mutation<{ success: boolean, id: string }, string>({
      query (id) {
        return {
          url: `tools/${id}`,
          method: 'DELETE'
        }
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      invalidatesTags: (result, error, id) => [{ type: 'Tools', id }]
    })
  })
})

export const useTools = toolsApi.useGetToolsQuery
export const useToolsAll = toolsApi.useGetToolsAllQuery
export const useUserTools = toolsApi.useGetUserToolsQuery
export const useSetTools = toolsApi.useSetToolsMutation
export const useTool = toolsApi.useGetToolQuery
export const useUpdateTool = toolsApi.useUpdateToolMutation
export const useDeleteTool = toolsApi.useDeleteToolMutation
