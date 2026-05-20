export interface CounterpartyLookupItem {
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

export type CounterpartyLookupResponse =
    | { status: 'single'; data: CounterpartyLookupItem }
    | { status: 'choose'; inn: string; candidates: CounterpartyLookupItem[] }
    | { status: 'requires_kpp'; inn: string }
