import { User } from '@/entities/User'

export interface AllMcpServers {
    count: number;
    rows: McpServer[];
}

export interface McpServer {
    id: number;
    name: string;
    url: string;
    transport: 'websocket' | 'http';
    authType: 'none' | 'bearer' | 'apikey' | 'custom_headers';
    authCredentials: Record<string, string> | null;
    status: 'active' | 'inactive' | 'error';
    lastConnectedAt: string | null;
    lastError: string | null;
    userId: number;
    user?: User;
    createdAt: string;
    updatedAt: string;
}

export interface McpTool {
    id: number;
    name: string;
    description: string | null;
    inputSchema: Record<string, any> | null;
    isEnabled: boolean;
    lastSyncedAt: string | null;
    mcpServerId: number;
    userId: number;
    mcpServer?: McpServer;
}

export interface McpToolPolicy {
    id: number;
    policyType: 'param_restrict' | 'rate_limit' | 'require_approval';
    policyConfig: {
        maxCallsPerMinute?: number;
        windowSeconds?: number;
        blockedParams?: string[];
    };
    mcpToolRegistryId: number;
    userId: number;
}

export interface McpCallLog {
    id: number;
    toolName: string;
    arguments: Record<string, any> | null;
    result: any;
    duration: number | null;
    status: 'success' | 'error' | 'blocked';
    channelId: string | null;
    source: 'webhook' | 'mcp' | 'builtin';
    mcpServerId: number | null;
    userId: number;
    createdAt: string;
}

// ─── DTOs (request bodies) ─────────────────────────────────

export interface CreateMcpServerDto {
    name: string;
    url: string;
    transport: 'websocket' | 'http';
    authType: 'none' | 'bearer' | 'apikey' | 'custom_headers';
    authCredentials?: {
        token?: string;
        apiKey?: string;
        [key: string]: string | undefined;
    };
}

export interface UpdateMcpServerDto {
    name?: string;
    url?: string;
    transport?: 'websocket' | 'http';
    authType?: 'none' | 'bearer' | 'apikey' | 'custom_headers';
    authCredentials?: {
        token?: string;
        apiKey?: string;
        [key: string]: string | undefined;
    };
}

export interface CreateMcpPolicyDto {
    policyType: 'param_restrict' | 'rate_limit' | 'require_approval';
    policyConfig: Record<string, any>;
    mcpToolRegistryId: number;
}
