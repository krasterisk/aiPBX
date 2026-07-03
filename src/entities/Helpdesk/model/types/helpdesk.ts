export type HelpdeskTicketStatus =
    | 'new'
    | 'in_progress'
    | 'waiting_client'
    | 'resolved'
    | 'closed'

export type HelpdeskTicketCategory =
    | 'technical'
    | 'billing'
    | 'sales'
    | 'other'

export type HelpdeskTicketPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface HelpdeskTicketMessage {
    id: number
    ticketId: number
    role: string
    content: string
    metadata?: Record<string, unknown> | null
    createdAt: string
}

export interface HelpdeskTicketStatusHistoryItem {
    id: number
    ticketId: number
    fromStatus: string | null
    toStatus: string
    changedByUserId: number | null
    note: string | null
    createdAt: string
}

export interface HelpdeskTicket {
    id: number
    status: HelpdeskTicketStatus
    category: HelpdeskTicketCategory | string
    priority: HelpdeskTicketPriority | string
    source: string
    subject: string
    description: string | null
    callerPhone: string | null
    contactPhone: string | null
    alfawebhookClientId: string | null
    inn: string | null
    clientName: string | null
    assigneeId: number | null
    createdByApiKeyId: number | null
    transcript: string | null
    createdAt: string
    updatedAt: string
    messages?: HelpdeskTicketMessage[]
    statusHistory?: HelpdeskTicketStatusHistoryItem[]
}

export interface HelpdeskTicketListQuery {
    status?: string
    category?: string
    priority?: string
    assigneeId?: string
    q?: string
}

export interface HelpdeskSettings {
    id: number
    notificationEmails: string[]
    notificationTelegramChatIds: string[]
    updatedAt: string
}

export interface HelpdeskLlmContext {
    clientKey: string
    summaryMarkdown: string
    rawMarkdown: string
    json: Record<string, unknown>
}

export interface CreateHelpdeskTicketDto {
    subject: string
    category?: string
    priority?: string
    description?: string
    callerPhone?: string
    contactPhone?: string
    clientName?: string
    inn?: string
    alfawebhookClientId?: string
    transcript?: string
    source?: string
}

export interface UpdateHelpdeskTicketDto {
    status?: HelpdeskTicketStatus
    category?: string
    priority?: string
    subject?: string
    description?: string
    transcript?: string
    assigneeId?: number | null
}

export interface CreateHelpdeskMessageDto {
    role?: string
    content: string
}

export interface UpdateHelpdeskSettingsDto {
    notificationEmails?: string[]
    notificationTelegramChatIds?: string[]
}

export interface UpdateLlmContextOverrideDto {
    markdownOverride?: string | null
}

export interface AlfawebhookClient {
    id?: string
    inn?: string
    kpp?: string
    name?: string
    pbxUrl?: string
    balance?: number
    licNum?: string
    email?: string
    phone?: string
    organizationId?: string
}

export interface HelpdeskIdentifyBody {
    phone?: string
    inn?: string
    name?: string
}

export interface HelpdeskIdentifyResult {
    found: boolean
    client?: AlfawebhookClient
    candidates?: AlfawebhookClient[]
    isCloud?: boolean
    message?: string
}

export function resolveHelpdeskClientKey(ticket: HelpdeskTicket): string | null {
    if (ticket.alfawebhookClientId) return `aw:${ticket.alfawebhookClientId}`
    if (ticket.inn) return `inn:${ticket.inn}`
    if (ticket.clientName) return `name:${ticket.clientName.trim().toLowerCase()}`
    return null
}
