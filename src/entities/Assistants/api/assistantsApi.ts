import { rtkApi } from '@/shared/api/rtkApi'
import { Assistant, AllAssistants } from '../model/types/assistants'

export interface QueryArgs {
  page: number
  limit: number
  sort?: string
  order?: string
  search?: string
  userId?: string
}

export const assistantsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getAssistants: build.query<AllAssistants, QueryArgs>({
      query: (args) => ({
        url: '/assistants/page',
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
            ...result.rows.map(({ id }) => ({ type: 'Assistants', id } as const)),
            { type: 'Assistants', id: 'LIST' }
          ]
          : [{ type: 'Assistants', id: 'LIST' }]
    }),
    getAssistantsAll: build.query<Assistant[], { userId?: string }>({
      query: (args) => ({
        url: '/assistants',
        params: args
      }),
      providesTags: (result) =>
        result?.length
          ? [
            ...result.map(({ id }) => ({ type: 'Assistants', id } as const)),
            { type: 'Assistants', id: 'LIST' }
          ]
          : [{ type: 'Assistants', id: 'LIST' }]
    }),
    getUserAssistants: build.query<Assistant[], string>({
      query: (userId) => ({
        url: `/assistants/user/${userId}`
      }),
      providesTags: (result) =>
        result?.length
          ? [
            ...result.map(({ id }) => ({ type: 'Assistants', id } as const)),
            { type: 'Assistants', id: 'LIST' }
          ]
          : [{ type: 'Assistants', id: 'LIST' }]
    }),
    setAssistants: build.mutation<Assistant[], Assistant[]>({
      query: (arg) => ({
        url: '/assistants',
        method: 'POST',
        body: arg
      }),
      invalidatesTags: [{ type: 'Assistants', id: 'LIST' }]
    }),
    getAssistant: build.query<Assistant, string>({
      query: (id) => `/assistants/${id}`,
      providesTags: (result, error, id) => [{ type: 'Assistants', id }]
    }),
    updateAssistant: build.mutation<Assistant, Pick<Assistant, 'id'> & Partial<Assistant>>({
      query: ({ id, ...patch }) => ({
        url: '/assistants',
        method: 'PATCH',
        body: { id, ...patch }
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          assistantsApi.util.updateQueryData('getAssistant', id!, (draft) => {
            Object.assign(draft, patch)
          })
        )
        queryFulfilled.catch(patchResult.undo)
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Assistants', id }]
    }),
    deleteAssistant: build.mutation<{ success: boolean, id: string }, string>({
      query(id) {
        return {
          url: `assistants/${id}`,
          method: 'DELETE'
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Assistants', id }]
    }),
    generatePrompt: build.mutation<{ success: boolean, greeting: string, instruction: string }, { assistantId: string, prompt: string }>({
      query: (arg) => ({
        url: '/assistants/generate-prompt',
        method: 'POST',
        body: arg
      })
    })
  })
})

export const useAssistants = assistantsApi.useGetAssistantsQuery
export const useAssistantsAll = assistantsApi.useGetAssistantsAllQuery
export const useUserAssistants = assistantsApi.useGetUserAssistantsQuery
export const useSetAssistants = assistantsApi.useSetAssistantsMutation
export const useAssistant = assistantsApi.useGetAssistantQuery
export const useUpdateAssistant = assistantsApi.useUpdateAssistantMutation
export const useDeleteAssistant = assistantsApi.useDeleteAssistantMutation
export const useGeneratePrompt = assistantsApi.useGeneratePromptMutation
