import { qualityApi } from './qualityApi'

const mockInvalidate = jest.fn(tags => ({ type: 'invalidate', payload: tags }))
jest.mock('@/shared/api/rtkApi', () => ({
    rtkApi: {
    injectEndpoints: ({ endpoints }: any) => ({ endpoints: endpoints({ query: (definition: unknown) => definition, mutation: (definition: unknown) => definition }) }),
    util: { invalidateTags: (tags: unknown) => mockInvalidate(tags) }
    }
}))

const started = (qualityApi.endpoints.getQualityDetail as unknown as { onQueryStarted: (args: { runId?: string }, lifecycle: unknown) => Promise<void> }).onQueryStarted
it('refreshes list, dashboard and drilldown caches after a current detail publishes its score', async () => {
    const dispatch = jest.fn()
    await started({}, { dispatch, queryFulfilled: Promise.resolve({ data: {} }) })
    expect(dispatch).toHaveBeenCalledWith({ type: 'invalidate', payload: [{ type: 'OperatorAnalytics', id: 'QUALITY-PREVIEW' }] })
})
it('does not invalidate the current score from historical or failed detail requests', async () => {
    const dispatch = jest.fn()
    await started({ runId: 'history' }, { dispatch, queryFulfilled: Promise.resolve({ data: {} }) })
    await started({}, { dispatch, queryFulfilled: Promise.reject(new Error('unavailable')) })
    expect(dispatch).not.toHaveBeenCalled()
})
