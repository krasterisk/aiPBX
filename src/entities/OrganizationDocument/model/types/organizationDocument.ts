export type OrganizationDocumentType =
    | 'invoice'
    | 'advance_invoice'
    | 'act'
    | 'sf'
    | 'upd'

export type OrganizationDocumentStatus =
    | 'issued'
    | 'paid'
    | 'sent_to_sbis'
    | 'accepted'
    | 'failed'
    | 'cancelled'
    | 'closed'

export interface OrganizationDocument {
    id: string
    userId: string
    organizationId: number
    type: OrganizationDocumentType
    number: string
    series: string
    documentDate: string
    periodFrom?: string | null
    periodTo?: string | null
    amountRub: string
    amountUsd?: string | null
    status: OrganizationDocumentStatus
    subject: string
    pdfPath?: string | null
    sbisId?: string | null
    sbisUrl?: string | null
    sbisStatus?: string | null
    sbisLastError?: string | null
    createdAt?: string
    updatedAt?: string
}
