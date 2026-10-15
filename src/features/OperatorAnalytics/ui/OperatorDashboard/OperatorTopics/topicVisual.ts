/** Stable palette across charts, matrix columns and contextual breakdowns. */
export const topicTone = (tagId: string | null): string => {
    if (tagId === null) return 'toneMissing'
    let hash = 0
    for (const char of tagId) hash = (hash * 31 + char.charCodeAt(0)) | 0
    return `tone${Math.abs(hash) % 7}`
}

export const heatLevel = (count: number, maximum: number): string => {
    const ratio = maximum > 0 ? count / maximum : 0
    return ratio >= 0.75 ? 'heat4' : ratio >= 0.5 ? 'heat3' : ratio >= 0.25 ? 'heat2' : 'heat1'
}

/** Numeric extensions/phone numbers should not produce a misleading numeric badge. */
export const operatorInitials = (name?: string | null): string => {
    const value = name?.trim()
    return !value || value === 'Unknown Operator' || /^[\d\s()+.-]+$/.test(value)
        ? ''
        : value.slice(0, 2).toLocaleUpperCase()
}
