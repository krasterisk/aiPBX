import type { CounterpartyLookupItem } from '../model/types/counterpartyLookup'
import { isValidOrganizationKpp, normalizeOrganizationInn } from './validateOrganizationKpp'

type LookupPopulatedExtra = {
    kpp: string
    ogrn: string
    legalForm: '' | 'ul' | 'ip'
    director: string
}

export function clearLookupPopulatedFields<T extends LookupPopulatedExtra>(
    setName: (v: string) => void,
    setAddress: (v: string) => void,
    setExtra: (updater: (s: T) => T) => void,
    options?: { keepKpp?: boolean },
): void {
    setName('')
    setAddress('')
    setExtra((s) => ({
        ...s,
        ...(options?.keepKpp ? {} : { kpp: '' }),
        ogrn: '',
        director: '',
    }))
}

export function applyCounterpartyToForm<T extends LookupPopulatedExtra>(
    data: CounterpartyLookupItem,
    setName: (v: string) => void,
    setAddress: (v: string) => void,
    setExtra: (updater: (s: T) => T) => void,
): void {
    setName(data.name || '')
    setAddress(data.address || '')
    const innDigits = normalizeOrganizationInn(data.inn)
    const nextKpp = data.kpp && isValidOrganizationKpp(data.kpp, data.inn) ? data.kpp : ''
    const defaultLegalForm = innDigits.length === 12 ? 'ip' : 'ul'
    setExtra((s) => ({
        ...s,
        kpp: nextKpp,
        ogrn: data.ogrn || '',
        legalForm: data.legalForm || defaultLegalForm,
        director: data.director || '',
    }))
}
