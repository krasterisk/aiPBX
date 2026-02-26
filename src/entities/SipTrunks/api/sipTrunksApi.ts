import { rtkApi } from '@/shared/api/rtkApi'

export type SipTrunkType = 'registration' | 'ip'
export type SipTransport = 'udp' | 'tcp' | 'tls'

export interface SipTrunk {
    id: string
    userId?: string
    assistantId?: string
    serverId?: string
    name: string
    trunkType: SipTrunkType
    sipServerAddress: string
    transport: SipTransport
    // Registration-based
    authName?: string
    password?: string
    domain?: string
    // IP-based
    callerId?: string
    providerIp?: string
    active: boolean
    createdAt?: string
    updatedAt?: string
    assistant?: {
        id: string
        name: string
        uniqueId?: string
    }
    server?: {
        id: string
        name: string
        location?: string
        sip_host?: string
    }
    user?: {
        id: string
        name: string
    }
}

export interface SipTrunkStatusResponse {
    registered: boolean
    status?: string
    error?: string
}

export interface CreateSipTrunkPayload {
    assistantId: string
    serverId: string
    name: string
    trunkType: SipTrunkType
    sipServerAddress: string
    transport: SipTransport
    authName?: string | null
    password?: string | null
    domain?: string | null
    callerId?: string | null
    providerIp?: string | null
    active: boolean
}

export interface UpdateSipTrunkPayload extends Partial<CreateSipTrunkPayload> {
    id: string
}

export const sipTrunksApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getSipTrunks: build.query<SipTrunk[], void>({
            query: () => '/sip-trunks',
            providesTags: (result) =>
                result?.length
                    ? [
                        ...result.map(({ id }) => ({ type: 'SipTrunks' as const, id })),
                        { type: 'SipTrunks', id: 'LIST' }
                    ]
                    : [{ type: 'SipTrunks', id: 'LIST' }]
        }),
        getSipTrunk: build.query<SipTrunk, string>({
            query: (id) => `/sip-trunks/${id}`,
            providesTags: (result, error, id) => [{ type: 'SipTrunks', id }]
        }),
        createSipTrunk: build.mutation<SipTrunk, CreateSipTrunkPayload>({
            query: (body) => ({
                url: '/sip-trunks',
                method: 'POST',
                body
            }),
            invalidatesTags: [{ type: 'SipTrunks', id: 'LIST' }]
        }),
        updateSipTrunk: build.mutation<SipTrunk, UpdateSipTrunkPayload>({
            query: ({ id, ...body }) => ({
                url: `/sip-trunks/${id}`,
                method: 'PUT',
                body
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'SipTrunks', id },
                { type: 'SipTrunks', id: 'LIST' }
            ]
        }),
        deleteSipTrunk: build.mutation<{ success: boolean }, string>({
            query: (id) => ({
                url: `/sip-trunks/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'SipTrunks', id },
                { type: 'SipTrunks', id: 'LIST' }
            ]
        }),
        getSipTrunkStatus: build.query<SipTrunkStatusResponse, string>({
            query: (id) => `/sip-trunks/${id}/status`,
        })
    })
})

export const useSipTrunks = sipTrunksApi.useGetSipTrunksQuery
export const useSipTrunk = sipTrunksApi.useGetSipTrunkQuery
export const useCreateSipTrunk = sipTrunksApi.useCreateSipTrunkMutation
export const useUpdateSipTrunk = sipTrunksApi.useUpdateSipTrunkMutation
export const useDeleteSipTrunk = sipTrunksApi.useDeleteSipTrunkMutation
export const useSipTrunkStatus = sipTrunksApi.useGetSipTrunkStatusQuery
