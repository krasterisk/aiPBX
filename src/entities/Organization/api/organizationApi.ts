import { rtkApi } from '@/shared/api/rtkApi'
import { Organization, OrganizationListResponse } from '../model/types/organization'
import type { CounterpartyLookupResponse } from '../model/types/counterpartyLookup'

export interface CreateOrganizationArgs {
    ownerUserId?: number
    name: string
    tin: string
    address: string
    legalForm?: 'ul' | 'ip' | null
    kpp?: string | null
    ogrn?: string | null
    director?: string | null
    email?: string | null
    phone?: string | null
    bankAccount?: string | null
    bankBic?: string | null
    bankName?: string | null
    subject?: string | null
}

const organizationApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getOrganizations: build.query<OrganizationListResponse, { userId?: string }>({
            query: (params) => ({
                url: '/organizations',
                method: 'GET',
                ...(params?.userId ? { params: { userId: params.userId } } : {}),
            }),
            providesTags: (_result, _error, arg) => [
                { type: 'Organization', id: arg?.userId ?? 'current' },
            ],
        }),
        createOrganization: build.mutation<Organization, CreateOrganizationArgs>({
            query: (args) => {
                const { ownerUserId, ...body } = args
                return {
                    url: '/organizations',
                    method: 'POST',
                    body: ownerUserId != null ? { ...body, ownerUserId } : body,
                }
            },
            invalidatesTags: ['Organization']
        }),
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
        }),
        lookupCounterparty: build.query<CounterpartyLookupResponse, { inn: string, kpp?: string }>({
            query: ({ inn, kpp }) => ({
                url: '/sbis/counterparty',
                method: 'GET',
                params: { inn, ...(kpp ? { kpp } : {}) },
            }),
        }),
    })
})

export const {
    useGetOrganizationsQuery,
    useCreateOrganizationMutation,
    useUpdateOrganizationMutation,
    useDeleteOrganizationMutation,
    useLookupCounterpartyQuery,
    useLazyLookupCounterpartyQuery,
} = organizationApi
