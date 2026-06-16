export type CsatFilterValue = '1' | '2' | '3' | '4' | '5' | 'none'

export const CSAT_SCORE_VALUES: Array<Exclude<CsatFilterValue, 'none'>> = [
  '1', '2', '3', '4', '5',
]

export function serializeCsatFilter(values: string[] | undefined): string | undefined {
  if (!values?.length) {
    return undefined
  }
  return values.join(',')
}

export function isCsatFilterActive(values: string[] | undefined): boolean {
  return Boolean(values?.length)
}
