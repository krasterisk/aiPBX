import { rtkApi } from '@/shared/api/rtkApi'
import {
    McpServer,
    AllMcpServers,
    McpTool,
    McpToolPolicy,
    McpCallLog,
    CreateMcpServerDto,
    UpdateMcpServerDto,
    CreateMcpPolicyDto
} from '../model/types/mcpTypes'

export interface McpQueryArgs {
    page: number
    limit: number
    sort?: string
    order?: string
    search?: string
    userId?: string
}

export const mcpApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        // ─── Servers (paginated) ─────────────────────────────
        getMcpServers: build.query<AllMcpServers, McpQueryArgs>({
            query: (args) => ({
                url: '/mcp/servers/page',
                params: args
            }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (currentCache, newItems, { arg }) => {
                if (arg.page === 1) {
                    return newItems
                } else {
                    currentCache.rows.push(...newItems.rows)
                    return currentCache
                }
            },
            forceRefetch({ currentArg, previousArg }) {
                return JSON.stringify(currentArg) !== JSON.stringify(previousArg)
            },
            providesTags: (result) =>
                result?.rows?.length
                    ? [
                        ...result.rows.map(({ id }) => ({ type: 'McpServers' as const, id })),
                        { type: 'McpServers', id: 'LIST' }
                    ]
                    : [{ type: 'McpServers', id: 'LIST' }]
        }),
        getMcpServersAll: build.query<McpServer[], null>({
            query: () => '/mcp/servers',
            providesTags: (result) =>
                result?.length
                    ? [
                        ...result.map(({ id }) => ({ type: 'McpServers' as const, id })),
                        { type: 'McpServers', id: 'LIST' }
                    ]
                    : [{ type: 'McpServers', id: 'LIST' }]
        }),
        getUserMcpServers: build.query<McpServer[], string>({
            query: (userId) => ({
                url: `/mcp/servers/user/${userId}`
            }),
            providesTags: (result) =>
                result?.length
                    ? [
                        ...result.map(({ id }) => ({ type: 'McpServers' as const, id })),
                        { type: 'McpServers', id: 'LIST' }
                    ]
                    : [{ type: 'McpServers', id: 'LIST' }]
        }),

        // ─── Server CRUD ─────────────────────────────────────
        createMcpServer: build.mutation<McpServer, CreateMcpServerDto>({
            query: (body) => ({ url: '/mcp/servers', method: 'POST', body }),
            invalidatesTags: [{ type: 'McpServers', id: 'LIST' }],
        }),
        updateMcpServer: build.mutation<McpServer, { id: number } & UpdateMcpServerDto>({
            query: ({ id, ...body }) => ({ url: `/mcp/servers/${id}`, method: 'PATCH', body }),
            invalidatesTags: [{ type: 'McpServers', id: 'LIST' }],
        }),
        deleteMcpServer: build.mutation<void, number>({
            query: (id) => ({ url: `/mcp/servers/${id}`, method: 'DELETE' }),
            invalidatesTags: [{ type: 'McpServers', id: 'LIST' }],
        }),

        // ─── Server Connection ───────────────────────────────
        connectMcpServer: build.mutation<void, number>({
            query: (id) => ({ url: `/mcp/servers/${id}/connect`, method: 'POST' }),
            invalidatesTags: [{ type: 'McpServers', id: 'LIST' }],
        }),
        disconnectMcpServer: build.mutation<void, number>({
            query: (id) => ({ url: `/mcp/servers/${id}/disconnect`, method: 'POST' }),
            invalidatesTags: [{ type: 'McpServers', id: 'LIST' }],
        }),

        // ─── Composio Integration ────────────────────────────
        composioConnect: build.mutation<{ redirectUrl: string }, { toolkit: string }>({
            query: (body) => ({ url: '/mcp/composio/connect', method: 'POST', body }),
        }),

        // ─── Tools ─────────────────────────────────────────
        syncMcpTools: build.mutation<McpTool[], number>({
            query: (serverId) => ({ url: `/mcp/servers/${serverId}/sync-tools`, method: 'POST' }),
            invalidatesTags: ['McpTools'],
        }),
        getMcpServerTools: build.query<McpTool[], number>({
            query: (serverId) => `/mcp/servers/${serverId}/tools`,
            providesTags: ['McpTools'],
        }),
        toggleMcpTool: build.mutation<McpTool, number>({
            query: (toolId) => ({ url: `/mcp/tools/${toolId}/toggle`, method: 'PATCH' }),
            invalidatesTags: ['McpTools'],
        }),

        // ─── Policies ──────────────────────────────────────
        createMcpToolPolicy: build.mutation<McpToolPolicy, CreateMcpPolicyDto>({
            query: ({ mcpToolRegistryId, ...body }) => ({
                url: `/mcp/tools/${mcpToolRegistryId}/policies`,
                method: 'POST',
                body: { ...body, mcpToolRegistryId }
            }),
            invalidatesTags: ['McpTools'],
        }),
        getMcpToolPolicies: build.query<McpToolPolicy[], number>({
            query: (toolId) => `/mcp/tools/${toolId}/policies`,
            providesTags: ['McpTools'],
        }),
        deleteMcpToolPolicy: build.mutation<void, number>({
            query: (policyId) => ({ url: `/mcp/policies/${policyId}`, method: 'DELETE' }),
            invalidatesTags: ['McpTools'],
        }),

        // ─── Audit Logs ────────────────────────────────────
        getMcpLogs: build.query<{ count: number; rows: McpCallLog[] }, { limit?: number; offset?: number }>({
            query: ({ limit = 50, offset = 0 }) => `/mcp/logs?limit=${limit}&offset=${offset}`,
        }),
    }),
})

// ─── Exported hooks ────────────────────────────────────────
export const useMcpServers = mcpApi.useGetMcpServersQuery
export const useMcpServersAll = mcpApi.useGetMcpServersAllQuery
export const useUserMcpServers = mcpApi.useGetUserMcpServersQuery
export const useCreateMcpServer = mcpApi.useCreateMcpServerMutation
export const useUpdateMcpServer = mcpApi.useUpdateMcpServerMutation
export const useDeleteMcpServer = mcpApi.useDeleteMcpServerMutation
export const useConnectMcpServer = mcpApi.useConnectMcpServerMutation
export const useDisconnectMcpServer = mcpApi.useDisconnectMcpServerMutation
export const useSyncMcpTools = mcpApi.useSyncMcpToolsMutation
export const useGetMcpServerTools = mcpApi.useGetMcpServerToolsQuery
export const useToggleMcpTool = mcpApi.useToggleMcpToolMutation
export const useCreateMcpToolPolicy = mcpApi.useCreateMcpToolPolicyMutation
export const useGetMcpToolPolicies = mcpApi.useGetMcpToolPoliciesQuery
export const useDeleteMcpToolPolicy = mcpApi.useDeleteMcpToolPolicyMutation
export const useGetMcpLogs = mcpApi.useGetMcpLogsQuery
export const useComposioConnect = mcpApi.useComposioConnectMutation
