import { rtkApi } from '@/shared/api/rtkApi'
import type {
    CreateHelpdeskMessageDto,
    CreateHelpdeskTicketDto,
    HelpdeskIdentifyBody,
    HelpdeskIdentifyResult,
    HelpdeskLlmContext,
    HelpdeskSettings,
    HelpdeskTicket,
    HelpdeskTicketListQuery,
    UpdateHelpdeskSettingsDto,
    UpdateHelpdeskTicketDto,
    UpdateLlmContextOverrideDto,
} from '../model/types/helpdesk'

export const helpdeskApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getHelpdeskTickets: build.query<HelpdeskTicket[], HelpdeskTicketListQuery | void>({
            query: (params) => ({
                url: '/helpdesk/tickets',
                params: params || undefined,
            }),
            providesTags: (result) =>
                result?.length
                    ? [
                        ...result.map(({ id }) => ({ type: 'Helpdesk' as const, id })),
                        { type: 'Helpdesk', id: 'LIST' },
                    ]
                    : [{ type: 'Helpdesk', id: 'LIST' }],
        }),
        getHelpdeskTicketById: build.query<HelpdeskTicket, number>({
            query: (id) => `/helpdesk/tickets/${id}`,
            providesTags: (result, error, id) => [{ type: 'Helpdesk', id }],
        }),
        createHelpdeskTicket: build.mutation<HelpdeskTicket, CreateHelpdeskTicketDto>({
            query: (body) => ({
                url: '/helpdesk/tickets',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Helpdesk', id: 'LIST' }],
        }),
        updateHelpdeskTicket: build.mutation<HelpdeskTicket, { id: number } & UpdateHelpdeskTicketDto>({
            query: ({ id, ...body }) => ({
                url: `/helpdesk/tickets/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Helpdesk', id },
                { type: 'Helpdesk', id: 'LIST' },
            ],
        }),
        claimHelpdeskTicket: build.mutation<HelpdeskTicket, number>({
            query: (id) => ({
                url: `/helpdesk/tickets/${id}/claim`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Helpdesk', id },
                { type: 'Helpdesk', id: 'LIST' },
            ],
        }),
        addHelpdeskMessage: build.mutation<unknown, { id: number } & CreateHelpdeskMessageDto>({
            query: ({ id, ...body }) => ({
                url: `/helpdesk/tickets/${id}/messages`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Helpdesk', id }],
        }),
        identifyHelpdeskClient: build.mutation<HelpdeskIdentifyResult, HelpdeskIdentifyBody>({
            query: (body) => ({
                url: '/helpdesk/clients/identify',
                method: 'POST',
                body,
            }),
        }),
        getHelpdeskSettings: build.query<HelpdeskSettings, void>({
            query: () => '/helpdesk/settings',
            providesTags: [{ type: 'Helpdesk', id: 'SETTINGS' }],
        }),
        updateHelpdeskSettings: build.mutation<HelpdeskSettings, UpdateHelpdeskSettingsDto>({
            query: (body) => ({
                url: '/helpdesk/settings',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: [{ type: 'Helpdesk', id: 'SETTINGS' }],
        }),
        getHelpdeskLlmContext: build.query<HelpdeskLlmContext, string>({
            query: (clientKey) => `/helpdesk/clients/${encodeURIComponent(clientKey)}/llm-context`,
            providesTags: (result, error, clientKey) => [{ type: 'Helpdesk', id: `CTX_${clientKey}` }],
        }),
        updateHelpdeskLlmContextOverride: build.mutation<
            HelpdeskLlmContext,
            { clientKey: string } & UpdateLlmContextOverrideDto
        >({
            query: ({ clientKey, ...body }) => ({
                url: `/helpdesk/clients/${encodeURIComponent(clientKey)}/llm-context`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { clientKey }) => [
                { type: 'Helpdesk', id: `CTX_${clientKey}` },
            ],
        }),
    }),
})

export const {
    useGetHelpdeskTicketsQuery,
    useGetHelpdeskTicketByIdQuery,
    useCreateHelpdeskTicketMutation,
    useIdentifyHelpdeskClientMutation,
    useUpdateHelpdeskTicketMutation,
    useClaimHelpdeskTicketMutation,
    useAddHelpdeskMessageMutation,
    useGetHelpdeskSettingsQuery,
    useUpdateHelpdeskSettingsMutation,
    useGetHelpdeskLlmContextQuery,
    useUpdateHelpdeskLlmContextOverrideMutation,
} = helpdeskApi
