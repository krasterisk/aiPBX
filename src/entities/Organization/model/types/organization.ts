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
    createdAt?: string
    updatedAt?: string
}

export interface OrganizationListResponse {
    rows: Organization[]
    count: number
}
