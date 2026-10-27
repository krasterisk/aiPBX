import { collectCdrExport } from './collectCdrExport'

it('collects more than 5000 records without an export cap', async () => {
    const all = Array.from({ length: 5001 }, (_, id) => ({ id: String(id) }))
    const load = jest.fn(async (page, limit) => ({ data: all.slice((page - 1) * limit, page * limit), total: all.length } as any))
    expect(await collectCdrExport(load)).toHaveLength(5001)
    expect(load).toHaveBeenCalledTimes(11)
})

it.each(['empty', 'overlap', 'changed'])('rejects a %s later page instead of producing a partial file', async kind => {
    const load = jest.fn().mockResolvedValueOnce({ data: [{ id: 'one' }], total: 2 }).mockResolvedValueOnce({ data: kind === 'empty' ? [] : [{ id: kind === 'overlap' ? 'one' : 'two' }], total: kind === 'changed' ? 3 : 2 })
    await expect(collectCdrExport(load)).rejects.toThrow()
})
