import { rtkApi } from '@/shared/api/rtkApi'
import { User, AllUsers, ResetUserPasswordProps } from '../model/types/user'

interface QueryArgs {
  page?: number
  limit?: number
  sort?: string
  order?: string
  search?: string
}

export const usersApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<AllUsers, QueryArgs>({
      query: (args) => ({
        url: '/users/page',
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
              ...result.rows.map(({ id }) => ({ type: 'Users', id } as const)),
              { type: 'Users', id: 'LIST' }
            ]
          : [{ type: 'Users', id: 'LIST' }]
    }),
    getAllUsers: build.query<User[], null>({
      query: () => ({
        url: '/users'
      }),
      providesTags: (result) =>
        result?.length
          ? [
              ...result.map(({ id }) => ({ type: 'Users', id } as const)),
              { type: 'Users', id: 'LIST' }
            ]
          : [{ type: 'Users', id: 'LIST' }]
    }),
    getUserBalance: build.query<{ balance: number, currency: string }, null>({
      query: () => ({
        url: '/users/balance'
      })
    }),
    setUsers: build.mutation<User, User>({
      query: (arg) => ({
        url: '/users',
        method: 'POST',
        body: arg
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }]
    }),
    updateUserPassword: build.mutation<User, ResetUserPasswordProps>({
      query: (arg) => ({
        url: '/users/updatePassword',
        method: 'POST',
        body: arg
      })
    }),
    registerUser: build.mutation<{ success: boolean }, User>({
      query: (arg) => ({
        url: '/users/register',
        method: 'POST',
        body: arg
      })
    }),
    forgotPassword: build.mutation<{ success: boolean }, User>({
      query: (arg) => ({
        url: '/users/forgotPassword',
        method: 'POST',
        body: arg
      })
    }),
    getUser: build.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }]
    }),
    uploadAvatarUser: build.mutation<User, { formData: FormData, id: string }>({
      query: ({ formData }) => ({
        url: '/users/avatar',
        method: 'PATCH',
        body: formData
      }),
      async onQueryStarted ({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData('getUser', id, (draft) => {
            Object.assign(draft, patch)
          })
        )
        queryFulfilled.catch(patchResult.undo)
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }]
    }),
    updateUser: build.mutation<User, Pick<User, 'id'> & Partial<User>>({
      query: ({ id, ...patch }) => ({
        url: '/users',
        method: 'PATCH',
        body: { id, ...patch }
      }),
      async onQueryStarted ({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          usersApi.util.updateQueryData('getUser', id, (draft) => {
            Object.assign(draft, patch)
          })
        )
        queryFulfilled.catch(patchResult.undo)
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }]
    }),
    deleteUser: build.mutation<{ success: boolean, id: string }, string>({
      query (id) {
        return {
          url: `/users/${id}`,
          method: 'DELETE'
        }
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      invalidatesTags: (result, error, id) => [{ type: 'Users', id }]
    })
  })
})

export const useGetUsers = usersApi.useGetUsersQuery
export const useGetAllUsers = usersApi.useGetAllUsersQuery
export const useGetUserBalance = usersApi.useGetUserBalanceQuery
export const useRegisterUser = usersApi.useRegisterUserMutation
export const useForgotPasswordUser = usersApi.useForgotPasswordMutation
export const useSetUsers = usersApi.useSetUsersMutation
export const useUpdateUserPassword = usersApi.useUpdateUserPasswordMutation
export const useGetUser = usersApi.useGetUserQuery
export const useUpdateUser = usersApi.useUpdateUserMutation
export const useUploadAvatarUser = usersApi.useUploadAvatarUserMutation
export const useDeleteUser = usersApi.useDeleteUserMutation
