import { rtkApi } from '@/shared/api/rtkApi'
import { WidgetKey, CreateWidgetDto, UpdateWidgetDto } from '../model/types/widgetKey'

export const widgetKeysApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getWidgetKeys: build.query<WidgetKey[], void>({
            query: () => ({
                url: '/widget-keys'
            }),
            providesTags: (result) =>
                result?.length
                    ? [
                        ...result.map(({ id }) => ({ type: 'WidgetKeys', id } as const)),
                        { type: 'WidgetKeys', id: 'LIST' }
                    ]
                    : [{ type: 'WidgetKeys', id: 'LIST' }]
        }),
        getWidgetKey: build.query<WidgetKey, number>({
            query: (id) => `/widget-keys/${id}`,
            providesTags: (result, error, id) => [{ type: 'WidgetKeys', id }]
        }),
        createWidgetKey: build.mutation<WidgetKey, CreateWidgetDto>({
            query: (body) => ({
                url: '/widget-keys',
                method: 'POST',
                body
            }),
            invalidatesTags: [{ type: 'WidgetKeys', id: 'LIST' }]
        }),
        updateWidgetKey: build.mutation<WidgetKey, { id: number } & UpdateWidgetDto>({
            query: ({ id, ...body }) => ({
                url: `/widget-keys/${id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'WidgetKeys', id },
                { type: 'WidgetKeys', id: 'LIST' }
            ]
        }),
        deleteWidgetKey: build.mutation<{ success: boolean }, number>({
            query: (id) => ({
                url: `/widget-keys/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'WidgetKeys', id },
                { type: 'WidgetKeys', id: 'LIST' }
            ]
        }),
        uploadWidgetLogo: build.mutation<{ logo: string }, FormData>({
            query: (formData) => ({
                url: '/widget-keys/logo',
                method: 'POST',
                body: formData
            })
        })
    })
})

export const useWidgetKeys = widgetKeysApi.useGetWidgetKeysQuery
export const useWidgetKey = widgetKeysApi.useGetWidgetKeyQuery
export const useCreateWidgetKey = widgetKeysApi.useCreateWidgetKeyMutation
export const useUpdateWidgetKey = widgetKeysApi.useUpdateWidgetKeyMutation
export const useDeleteWidgetKey = widgetKeysApi.useDeleteWidgetKeyMutation
export const useUploadWidgetLogo = widgetKeysApi.useUploadWidgetLogoMutation
