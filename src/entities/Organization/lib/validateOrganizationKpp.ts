export function normalizeOrganizationKpp(value: string): string {
    return value.replace(/\D/g, '')
}

export function normalizeOrganizationInn(value: string): string {
    return value.replace(/\D/g, '')
}

/** KPP must be 9 digits and must not be a prefix of a 10-digit INN (common mistype). */
export function isValidOrganizationKpp(kppRaw: string, innRaw: string): boolean {
    const kpp = normalizeOrganizationKpp(kppRaw)
    const inn = normalizeOrganizationInn(innRaw)
    if (kpp.length !== 9) return false
    if (inn.length === 10 && inn.startsWith(kpp)) return false
    return true
}
