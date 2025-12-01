import { rtkApi } from '@/shared/api/rtkApi'
import { PbxServer, AllPbxServers } from '../model/types/pbxServers'

export interface QueryArgs {
  page: number
  limit: number
  sort?: string
  order?: string
  search?: string
  userId?: string
}

export const pbxServersApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getPbxServers: build.query<AllPbxServers, QueryArgs>({
      query: (args) => ({
        url: '/pbx-servers/page',
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
              ...result.rows.map(({ id }) => ({ type: 'PbxServers', id } as const)),
              { type: 'PbxServers', id: 'LIST' }
            ]
          : [{ type: 'PbxServers', id: 'LIST' }]
    }),
    getPbxServersAll: build.query<PbxServer[], null>({
      query: (args) => ({
        url: '/pbx-servers'
      }),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: 'PbxServers', id } as const)),
              { type: 'PbxServers', id: 'LIST' }
            ]
          : [{ type: 'PbxServers', id: 'LIST' }]
    }),
    setPbxServers: build.mutation<PbxServer, PbxServer>({
      query: (arg) => ({
        url: '/pbx-servers',
        method: 'POST',
        body: arg
      }),
      invalidatesTags: [{ type: 'PbxServers', id: 'LIST' }]
    }),
    checkPbxServer: build.mutation<PbxServer, PbxServer>({
      query: (arg) => ({
        url: '/pbx-servers/check',
        method: 'POST',
        body: arg
      }),
      invalidatesTags: [{ type: 'PbxServers', id: 'LIST' }]
    }),
    getPbxServer: build.query<PbxServer, string>({
      query: (id) => `/pbx-servers/${id}`,
      providesTags: (result, error, id) => [{ type: 'PbxServers', id }]
    }),
    updatePbxServer: build.mutation<PbxServer, Pick<PbxServer, 'id'> & Partial<PbxServer>>({
      query: ({ id, ...patch }) => ({
        url: '/pbx-servers',
        method: 'PATCH',
        body: { id, ...patch }
      }),
      async onQueryStarted ({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          pbxServersApi.util.updateQueryData('getPbxServer', id!, (draft) => {
            Object.assign(draft, patch)
          })
        )
        queryFulfilled.catch(patchResult.undo)
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'PbxServers', id }]
    }),
    deletePbxServer: build.mutation<{ success: boolean, id: string }, string>({
      query (id) {
        return {
          url: `pbx-servers/${id}`,
          method: 'DELETE'
        }
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      invalidatesTags: (result, error, id) => [{ type: 'PbxServers', id }]
    })
  })
})

export const usePbxServers = pbxServersApi.useGetPbxServersQuery
export const usePbxServersAll = pbxServersApi.useGetPbxServersAllQuery
export const useSetPbxServers = pbxServersApi.useSetPbxServersMutation
export const useCheckPbxServer = pbxServersApi.useCheckPbxServerMutation
export const usePbxServer = pbxServersApi.useGetPbxServerQuery
export const useUpdatePbxServers = pbxServersApi.useUpdatePbxServerMutation
export const useDeletePbxServers = pbxServersApi.useDeletePbxServerMutation
