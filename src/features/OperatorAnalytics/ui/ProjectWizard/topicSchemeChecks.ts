import type { SchemeResult, SchemeState } from './topicSchemeApi'

export interface SchemeTestCase { text: string, expectedTopicId?: string }
interface CheckResponse { state: SchemeState, results: SchemeResult[] }

/** Keep each HTTP request bounded; publish progress only after a server receipt. */
export async function runTopicSchemeChecks(
    cases: SchemeTestCase[],
    checkOne: (cases: SchemeTestCase[]) => Promise<CheckResponse>,
    onProgress: (response: CheckResponse) => void,
    stopped: () => boolean
) {
    const results: SchemeResult[] = []
    for (const test of cases) {
        if (stopped()) return
        const response = await checkOne([test])
        results.push(...response.results)
        if (stopped()) return
        onProgress({ state: response.state, results: [...results] })
    }
}
