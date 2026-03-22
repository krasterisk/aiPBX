import { rtkApi } from '@/shared/api/rtkApi'
import { Chat, CreateChatDto, UpdateChatDto } from '../model/types/chat'

export const chatApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getChats: build.query<Chat[], void>({
      query: () => '/chats',
      providesTags: (result) =>
        result?.length
          ? [
            ...result.map(({ id }) => ({ type: 'Chats' as const, id })),
            { type: 'Chats', id: 'LIST' }
          ]
          : [{ type: 'Chats', id: 'LIST' }]
    }),
    getChatById: build.query<Chat, number>({
      query: (id) => `/chats/${id}`,
      providesTags: (result, error, id) => [{ type: 'Chats', id }]
    }),
    createChat: build.mutation<Chat, CreateChatDto>({
      query: (body) => ({
        url: '/chats',
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'Chats', id: 'LIST' }]
    }),
    updateChat: build.mutation<Chat, { id: number } & UpdateChatDto>({
      query: ({ id, ...body }) => ({
        url: `/chats/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: [{ type: 'Chats', id: 'LIST' }]
    }),
    deleteChat: build.mutation<void, number>({
      query: (id) => ({
        url: `/chats/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Chats', id: 'LIST' }]
    })
  })
})

export const useChats = chatApi.useGetChatsQuery
export const useChatById = chatApi.useGetChatByIdQuery
export const useCreateChat = chatApi.useCreateChatMutation
export const useUpdateChat = chatApi.useUpdateChatMutation
export const useDeleteChat = chatApi.useDeleteChatMutation
