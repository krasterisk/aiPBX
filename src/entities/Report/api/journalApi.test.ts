import { configureStore } from '@reduxjs/toolkit'
import { journalApi, type JournalQuery } from './journalApi'
import { reportApi } from './reportApi'

it('refreshes journal pages after native delete/reanalysis/tag updates without sharing the legacy cache', async () => {
    const store: any = configureStore({ reducer: { [journalApi.reducerPath]: journalApi.reducer }, middleware: get => get().concat(journalApi.middleware) })
    const query: JournalQuery = { page: 1, limit: 20, search: '', userId: '99', startDate: '2026-10-25T00:00:00Z', endDate: '2026-10-25T23:59:59Z', sortField: 'createdAt', sortOrder: 'DESC' }
    await store.dispatch(journalApi.util.upsertQueryData('getCallJournal', query, { rows: [{ id: 'row-1', channelId: 'channel-1' } as any], count: 1, totalCost: 0 }))
    await store.dispatch(reportApi.util.upsertQueryData('getReports', { page: 1, limit: 20 }, { rows: [], count: 77, totalCost: 0 }))
    await store.dispatch(journalApi.util.upsertQueryData('getCallJournal', { ...query, page: 2 }, { rows: [{ id: 'row-2', channelId: 'channel-2' } as any], count: 2, totalCost: 0 }))
    expect(journalApi.endpoints.getCallJournal.select(query)(store.getState()).data?.rows[0].id).toBe('row-1')
    expect(journalApi.endpoints.getCallJournal.select({ ...query, page: 2 })(store.getState()).data?.rows[0].id).toBe('row-2')
    expect(reportApi.endpoints.getReports.select({ page: 1, limit: 20 })(store.getState()).data?.count).toBe(77)
    for (const tag of [{ type: 'Reports', id: 'LIST' }, { type: 'Reports', id: 'row-1' }, { type: 'OperatorAnalytics', id: 'channel-1' }] as const) {
        const invalidated = journalApi.util.selectInvalidatedBy(store.getState(), [tag])
        expect(invalidated.map(item => item.endpointName)).toContain('getCallJournal')
        if (tag.type === 'OperatorAnalytics') expect(invalidated.map(item => item.endpointName)).not.toContain('getReports')
    }
    store.dispatch(journalApi.util.resetApiState())
})
