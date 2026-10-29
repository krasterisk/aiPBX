import { configureStore } from '@reduxjs/toolkit'
import { qualityPreviewApi } from './qualityPreviewApi'
import { journalApi, type JournalQuery } from './journalApi'

it('keeps preview pages and correction invalidation separate from the existing journal', async () => {
    const api = qualityPreviewApi
    const store: any = configureStore({ reducer: { [api.reducerPath]: api.reducer }, middleware: get => get().concat(api.middleware) })
    const query: JournalQuery = { page: 1, limit: 20, search: '', userId: '99', startDate: '2026-10-25T00:00:00Z', endDate: '2026-10-25T23:59:59Z', sortField: 'qualityScore', sortOrder: 'DESC' }
    await store.dispatch(api.util.upsertQueryData('qualityJournal', query, { rows: [], count: 10, totalCost: 0 }))
    await store.dispatch(journalApi.util.upsertQueryData('getCallJournal', query, { rows: [], count: 20, totalCost: 0 }))
    expect(api.endpoints.qualityJournal.select(query)(store.getState()).data?.count).toBe(10)
    expect(journalApi.endpoints.getCallJournal.select(query)(store.getState()).data?.count).toBe(20)
    const invalidated = api.util.selectInvalidatedBy(store.getState(), [{ type: 'OperatorAnalytics', id: 'QUALITY-PREVIEW' }])
    expect(invalidated.map(item => item.endpointName)).toEqual(['qualityJournal'])
    await store.dispatch(api.util.upsertQueryData('qualityDashboard', { projectId: '5' }, {} as any))
    await store.dispatch(api.util.upsertQueryData('qualityCdrs', { projectId: '5', page: 1, limit: 10 }, { data: [], total: 0, page: 1, limit: 10 }))
    await store.dispatch(api.util.upsertQueryData('qualityEvidence', { projectId: '5' }, {} as any))
    const readers = api.util.selectInvalidatedBy(store.getState(), [{ type: 'OperatorAnalytics', id: 'QUALITY-PREVIEW' }])
    expect(readers.map(item => item.endpointName).sort()).toEqual(['qualityCdrs', 'qualityDashboard', 'qualityEvidence', 'qualityJournal'])
    store.dispatch(api.util.resetApiState())
})
