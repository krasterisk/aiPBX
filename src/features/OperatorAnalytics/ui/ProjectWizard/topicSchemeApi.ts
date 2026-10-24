import { rtkApi } from '@/shared/api/rtkApi'

export interface SchemeTopic {
    id: string
    name: string
    when: string
    exclude: string
    examples: string[]
}
export interface TopicScheme {
    version: 1
    topics: SchemeTopic[]
    fallbackTopicId: string
}
export interface SchemeCheck {
    inputHash: string
    expectedTopicId?: string
    selectedTopicId: string
    model: string
    checkedAt: string
}
export interface SchemeVersion {
    revision: string
    scheme: TopicScheme
    checks: SchemeCheck[]
    createdAt: string
    businessContext?: string | null
    checkRun?: { id: string, status: 'running' | 'passed' | 'failed' }
}
export interface SchemeState {
    active: SchemeVersion | null
    draft: SchemeVersion | null
    history: SchemeVersion[]
}
export interface SchemeResult {
    topicIds: string[]
    model: string
    expectedTopicId?: string
    decision: {
        selectedTopicId: string
        eligibleTopicIds: string[]
        reason: string
        evidence: Record<string, { matches: boolean, reason: string }>
    }
}
export const topicSchemeApi = rtkApi.injectEndpoints({
    endpoints: build => ({
        topicScheme: build.query<SchemeState, string>({
            query: id => `/operator-analytics/projects/${id}/topic-scheme`,
            providesTags: ['OperatorProjects']
        }),
        saveTopicSchemeDraft: build.mutation<SchemeState, { id: string, scheme: TopicScheme, expectedDraftRevision: string | null, businessContext?: string | null }>({
            query: ({ id, ...body }) => ({ url: `/operator-analytics/projects/${id}/topic-scheme/draft`, method: 'POST', body })
        }),
        checkTopicScheme: build.mutation<
            { state: SchemeState, results: SchemeResult[] },
            { id: string, revision: string, cases: Array<{ text: string, expectedTopicId?: string }> }
        >({
            query: ({ id, ...body }) => ({ url: `/operator-analytics/projects/${id}/topic-scheme/check`, method: 'POST', body })
        }),
        applyTopicScheme: build.mutation<SchemeState, { id: string, revision: string }>({
            query: ({ id, ...body }) => ({ url: `/operator-analytics/projects/${id}/topic-scheme/apply`, method: 'POST', body }),
            invalidatesTags: ['OperatorProjects']
        })
    })
})
