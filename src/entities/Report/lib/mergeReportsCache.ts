import { AllReports } from '../model/types/report'

export interface ReportsListQueryArgs {
  page?: number
  limit?: number
  search?: string
  tab?: string
  assistantId?: string[]
  startDate?: string
  endDate?: string
  userId?: string
  sortField?: string
  sortOrder?: 'ASC' | 'DESC'
  source?: string
  listGeneration?: number
  csat?: string
}

function dedupeReportsById(rows: AllReports['rows']): AllReports['rows'] {
  const seen = new Set<string>()

  return rows.filter((row) => {
    if (seen.has(row.id)) {
      return false
    }
    seen.add(row.id)
    return true
  })
}

/** Cache key groups all pages of the same filter/sort set; page is excluded on purpose. */
export function serializeReportsQueryArgs(
  endpointName: string,
  queryArgs: ReportsListQueryArgs = {},
): string {
  const { page: _page, ...cacheKeyArgs } = queryArgs
  return `${endpointName}(${JSON.stringify(cacheKeyArgs)})`
}

/**
 * Merges paginated report list responses.
 * Ignores out-of-order or stale page responses (e.g. after sort/filter change).
 */
export function mergeReportsCache(
  currentCache: AllReports | undefined,
  newItems: AllReports,
  arg: ReportsListQueryArgs,
): AllReports {
  const page = Number(arg.page) || 1
  const limit = Number(arg.limit) || 25

  if (page === 1) {
    return {
      ...newItems,
      rows: dedupeReportsById(newItems.rows),
    }
  }

  const cache = currentCache ?? { count: 0, totalCost: 0, rows: [] }
  const expectedPage = Math.floor(cache.rows.length / limit) + 1

  if (page !== expectedPage) {
    return cache
  }

  const existingIds = new Set(cache.rows.map((row) => row.id))
  const newRows = newItems.rows.filter((row) => !existingIds.has(row.id))

  return {
    ...cache,
    count: newItems.count,
    rows: [...cache.rows, ...newRows],
  }
}
