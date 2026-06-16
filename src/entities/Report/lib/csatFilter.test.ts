import { serializeCsatFilter, isCsatFilterActive } from './csatFilter'

describe('csatFilter', () => {
  it('serializes selected values', () => {
    expect(serializeCsatFilter(['1', '3', 'none'])).toBe('1,3,none')
  })

  it('returns undefined for empty filter', () => {
    expect(serializeCsatFilter([])).toBeUndefined()
  })

  it('detects active filter', () => {
    expect(isCsatFilterActive(['2'])).toBe(true)
    expect(isCsatFilterActive([])).toBe(false)
  })
})
