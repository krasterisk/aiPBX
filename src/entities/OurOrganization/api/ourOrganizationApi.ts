import { rtkApi } from '@/shared/api/rtkApi'
import type { CreateOurOrganizationDto, OurOrganization } from '../model/types/ourOrganization'

const ourOrganizationApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getOurOrganizations: build.query<OurOrganization[], void>({
            query: () => ({ url: '/our-organizations', method: 'GET' }),
            providesTags: (result) =>
                result?.length
                    ? [
                        ...result.map(({ id }) => ({ type: 'OurOrganization' as const, id })),
                        { type: 'OurOrganization', id: 'LIST' },
                    ]
                    : [{ type: 'OurOrganization', id: 'LIST' }],
        }),
        createOurOrganization: build.mutation<OurOrganization, CreateOurOrganizationDto>({
            query: (body) => ({
                url: '/our-organizations',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'OurOrganization', id: 'LIST' }],
        }),
        updateOurOrganization: build.mutation<OurOrganization, { id: string, body: CreateOurOrganizationDto }>({
            query: ({ id, body }) => ({
                url: `/our-organizations/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (_res, _err, { id }) => [
                { type: 'OurOrganization', id },
                { type: 'OurOrganization', id: 'LIST' },
            ],
        }),
        deleteOurOrganization: build.mutation<void, string>({
            query: (id) => ({
                url: `/our-organizations/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'OurOrganization', id: 'LIST' }],
        }),
    }),
})

export const {
    useGetOurOrganizationsQuery,
    useCreateOurOrganizationMutation,
    useUpdateOurOrganizationMutation,
    useDeleteOurOrganizationMutation,
} = ourOrganizationApi
