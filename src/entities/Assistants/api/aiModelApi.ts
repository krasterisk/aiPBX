import { rtkApi } from '@/shared/api/rtkApi'
import { AiModel } from '../model/types/aiModel'

export const aiModelApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getAllAiModels: build.query<AiModel[], null>({
      query: () => ({
        url: '/aiModels'
      }),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: 'AiModels', id } as const)),
              { type: 'AiModels', id: 'LIST' }
            ]
          : [{ type: 'AiModels', id: 'LIST' }]
    }),
    setAiModels: build.mutation<AiModel, AiModel>({
      query: (arg) => ({
        url: '/aiModels',
        method: 'POST',
        body: arg
      }),
      invalidatesTags: [{ type: 'AiModels', id: 'LIST' }]
    }),
    getAiModel: build.query<AiModel, string>({
      query: (id) => `/aiModels/${id}`,
      providesTags: (result, error, id) => [{ type: 'AiModels', id }]
    }),
    updateAiModel: build.mutation<AiModel, Pick<AiModel, 'id'> & Partial<AiModel>>({
      query: ({ id, ...patch }) => ({
        url: '/aiModels',
        method: 'PATCH',
        body: { id, ...patch }
      }),
      async onQueryStarted ({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          aiModelApi.util.updateQueryData('getAiModel', id, (draft) => {
            Object.assign(draft, patch)
          })
        )
        queryFulfilled.catch(patchResult.undo)
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'AiModels', id }]
    }),
    deleteAiModel: build.mutation<{ success: boolean, id: string }, string>({
      query (id) {
        return {
          url: `/aiModels/${id}`,
          method: 'DELETE'
        }
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      invalidatesTags: (result, error, id) => [{ type: 'AiModels', id }]
    })
  })
})

export const useGetAllModels = aiModelApi.useGetAllAiModelsQuery
