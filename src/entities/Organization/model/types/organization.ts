export interface Organization {
    id: string
    userId: string
    name: string
    tin: string
    address: string
    kpp?: string | null
    ogrn?: string | null
    legalForm?: 'ul' | 'ip' | null
    director?: string | null
    email?: string | null
    phone?: string | null
    bankAccount?: string | null
    bankBic?: string | null
    bankName?: string | null
    subject?: string | null
    edoParticipantId?: string | null
    edoInvitationId?: string | null
    edoInvitationStateCode?: number | null
    edoInvitationStateAt?: string | null
    edo?: {
        edoParticipantId: string | null
        edoOperatorLabel: string | null
        edoInvitationId: string | null
        edoInvitationStateCode: number | null
        edoInvitationStateDescription: string | null
        edoInvitationStateAt: string | null
        edoReady: boolean
    }
    createdAt?: string
    updatedAt?: string
}

export interface OrganizationListResponse {
    rows: Organization[]
    count: number
}

export type OrganizationEdoStatus = Organization['edo']

export type CreateOrganizationEdoResult =
    | { success: true, edo: OrganizationEdoStatus }
    | { success: false, error: string }

export interface CreateOrganizationResponse {
    organization: Organization
    edo?: CreateOrganizationEdoResult
}
