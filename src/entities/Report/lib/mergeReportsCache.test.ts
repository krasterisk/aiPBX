import { mergeReportsCache, serializeReportsQueryArgs } from './mergeReportsCache'
import { AllReports } from '../model/types/report'

const makePage = (ids: number[], count = 100): AllReports => ({
  count,
  totalCost: 0,
  rows: ids.map((id) => ({ id: String(id) } as AllReports['rows'][number])),
})

describe('serializeReportsQueryArgs', () => {
  it('excludes page from cache key', () => {
    const base = serializeReportsQueryArgs('getReports', {
      page: 1,
      limit: 25,
      sortField: 'csat',
      sortOrder: 'ASC',
    })
    const nextPage = serializeReportsQueryArgs('getReports', {
      page: 2,
      limit: 25,
      sortField: 'csat',
      sortOrder: 'ASC',
    })

    expect(base).toBe(nextPage)
  })

  it('uses different keys for different sort params', () => {
    const csat = serializeReportsQueryArgs('getReports', { sortField: 'csat', sortOrder: 'ASC' })
    const cost = serializeReportsQueryArgs('getReports', { sortField: 'cost', sortOrder: 'DESC' })

    expect(csat).not.toBe(cost)
  })
})

describe('mergeReportsCache', () => {
  it('replaces cache on page 1', () => {
    const current = makePage([1, 2, 3])
    const incoming = makePage([10, 11])

    const result = mergeReportsCache(current, incoming, { page: 1, limit: 25 })

    expect(result.rows.map((row) => row.id)).toEqual(['10', '11'])
  })

  it('appends the next sequential page', () => {
    const current = makePage([1, 2, 3])
    const incoming = makePage([4, 5])

    const result = mergeReportsCache(current, incoming, { page: 2, limit: 3 })

    expect(result.rows.map((row) => row.id)).toEqual(['1', '2', '3', '4', '5'])
    expect(result.count).toBe(100)
  })

  it('ignores stale page after sort reset (page 2 with only page 1 in cache)', () => {
    const current = makePage([1, 2, 3])
    const stalePage = makePage([99, 98])

    const result = mergeReportsCache(current, stalePage, {
      page: 2,
      limit: 25,
      sortField: 'createdAt',
    })

    expect(result.rows.map((row) => row.id)).toEqual(['1', '2', '3'])
  })

  it('ignores out-of-order page 3 before page 2', () => {
    const current = makePage([1, 2, 3])
    const page3 = makePage([7, 8, 9])

    const result = mergeReportsCache(current, page3, { page: 3, limit: 3 })

    expect(result.rows.map((row) => row.id)).toEqual(['1', '2', '3'])
  })

  it('deduplicates overlapping rows on append', () => {
    const current = makePage([2261, 2, 3])
    const incoming = makePage([2261, 4, 5])

    const result = mergeReportsCache(current, incoming, { page: 2, limit: 3 })

    expect(result.rows.map((row) => row.id)).toEqual(['2261', '2', '3', '4', '5'])
  })

  it('treats string page "1" as first page replace', () => {
    const current = makePage([1, 2, 3])
    const incoming = makePage([10, 11])

    const result = mergeReportsCache(current, incoming, { page: '1' as unknown as number, limit: 25 })

    expect(result.rows.map((row) => row.id)).toEqual(['10', '11'])
  })
})
