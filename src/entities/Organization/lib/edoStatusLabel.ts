import type { TFunction } from 'i18next'
import type { Organization } from '../model/types/organization'

export function getOrganizationEdoStateCode(org: Organization): number | null | undefined {
    return org.edoInvitationStateCode ?? org.edo?.edoInvitationStateCode ?? null
}

export function getOrganizationEdoInvitationId(org: Organization): string | null | undefined {
    const id = org.edoInvitationId ?? org.edo?.edoInvitationId
    return id?.trim() ? id : null
}

export function getOrganizationEdoStatusLabel(org: Organization, t: TFunction<'payment'>): string {
    const code = getOrganizationEdoStateCode(org)
    const invitationId = getOrganizationEdoInvitationId(org)

    if (code === 7) return String(t('organization.edo.status.connected'))
    if (code === 9) return String(t('organization.edo.status.routeBroken'))
    if (code === 2 || invitationId) return String(t('organization.edo.status.invitationSent'))
    return String(t('organization.edo.status.notConnected'))
}

export function canSyncOrganizationEdoInvitation(org: Organization): boolean {
    const invitationId = getOrganizationEdoInvitationId(org)
    const code = getOrganizationEdoStateCode(org)
    return !!invitationId && code !== 7
}
