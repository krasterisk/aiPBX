import { runTopicSchemeChecks } from './topicSchemeChecks'
import type { SchemeResult } from './topicSchemeApi'

const cases = [1, 2, 3].map(i => ({ text: `Synthetic request ${i}`, expectedTopicId: String(i) }))
const response = { state: { active: null, draft: null, history: [] }, results: [{} as SchemeResult] }

it('sends one case per HTTP request and reports cumulative confirmed results', async () => {
    const request = jest.fn(async () => response)
    const progress = jest.fn()
    await runTopicSchemeChecks(cases, request, progress, () => false)
    expect(request.mock.calls).toEqual(cases.map(c => [[c]]))
    expect(progress.mock.calls.map(([r]) => r.results.length)).toEqual([1, 2, 3])
})

it('stops after a failed request without claiming remaining cases passed', async () => {
    const request = jest.fn().mockResolvedValueOnce(response).mockRejectedValueOnce(new Error('Network timeout'))
    const progress = jest.fn()
    await expect(runTopicSchemeChecks(cases, request, progress, () => false)).rejects.toThrow('Network timeout')
    expect(request).toHaveBeenCalledTimes(2)
    expect(progress).toHaveBeenCalledTimes(1)
})

it('does not enqueue more model calls after the form closes', async () => {
    let closed = false
    const request = jest.fn(async () => { closed = true; return response })
    const progress = jest.fn()
    await runTopicSchemeChecks(cases, request, progress, () => closed)
    expect(request).toHaveBeenCalledTimes(1)
    expect(progress).not.toHaveBeenCalled()
})
