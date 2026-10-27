import type { OperatorCdrResponse } from '@/entities/Report'

/** Fetch a fresh complete selection; never return a silently truncated export. */
export async function collectCdrExport(load: (page: number, limit: number) => Promise<OperatorCdrResponse>) {
    const rows: OperatorCdrResponse['data'] = []
    const seen = new Set<string>()
    let total: number | undefined
    for (let page = 1; ; page++) {
        const result = await load(page, 500)
        if (!Number.isSafeInteger(result.total) || result.total < 0 || (total !== undefined && total !== result.total)) throw new Error('Export selection changed')
        total = result.total
        for (const row of result.data) {
            const id = String(row.id)
            if (seen.has(id)) throw new Error('Export pages overlap')
            seen.add(id)
            rows.push(row)
        }
        if (rows.length === total) return rows
        if (!result.data.length || rows.length > total) throw new Error('Incomplete export')
    }
}
