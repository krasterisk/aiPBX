import { rtkApi } from '@/shared/api/rtkApi'
import { Organization, OrganizationListResponse } from '../model/types/organization'

interface CreateOrganizationArgs {
    userId: string
    name: string
    tin: string
    address: string
}

const organizationApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getOrganizations: build.query<OrganizationListResponse, { userId?: string }>({
            query: (params) => ({
                url: '/organizations',
                method: 'GET',
                params
            }),
            providesTags: ['Organization']
        }),
        createOrganization: build.mutation<Organization, CreateOrganizationArgs>({
            query: (args) => ({
                url: '/organizations',
                method: 'POST',
                body: args
            }),
            invalidatesTags: ['Organization']
        }), // Added comma and closing brace for createOrganization
        updateOrganization: build.mutation<Organization, Partial<Organization> & { id: string }>({
            query: ({ id, ...body }) => ({
                url: `/organizations/${id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: ['Organization']
        }),
        deleteOrganization: build.mutation<void, string>({
            query: (id) => ({
                url: `/organizations/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Organization']
        })
    })
})

export const {
    useGetOrganizationsQuery,
    useCreateOrganizationMutation,
    useUpdateOrganizationMutation,
    useDeleteOrganizationMutation
} = organizationApi
