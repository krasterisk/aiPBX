export interface CounterpartyLookupResponse {
    inn: string
    kpp: string | null
    name: string
    fullName: string | null
    address: string | null
    ogrn: string | null
    director: string | null
    directorPosition: string | null
    okpo: string | null
    legalForm: 'ul' | 'ip'
    sbisCounterpartyId: string | null
    fromCache?: boolean
}
