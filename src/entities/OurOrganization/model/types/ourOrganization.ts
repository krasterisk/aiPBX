export interface OurOrganization {
    id: string
    name: string
    tin: string
    address: string
    kpp?: string | null
    ogrn?: string | null
    legalForm?: 'ul' | 'ip' | null
    director?: string | null
    isPrimary: boolean
    bankName?: string | null
    bankBranchName?: string | null
    bankBic?: string | null
    bankAccount?: string | null
    bankCorrAccount?: string | null
    edoParticipantId?: string | null
    sbisCertThumbprint?: string | null
}

export interface CreateOurOrganizationDto {
    name: string
    tin: string
    address: string
    kpp?: string | null
    ogrn?: string | null
    legalForm?: 'ul' | 'ip' | null
    director?: string | null
    isPrimary?: boolean
    bankName?: string | null
    bankBranchName?: string | null
    bankBic?: string | null
    bankAccount?: string | null
    bankCorrAccount?: string | null
    edoParticipantId?: string | null
    sbisCertThumbprint?: string | null
}

export interface UpdateOurOrganizationDto extends CreateOurOrganizationDto {
    id: string
}
