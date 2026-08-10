import { DEFAULT_DEBUG_FILTERS, createDefaultDebugFilters, defaultFiltersExcludeAudio } from './debugFilters'

describe('debugFilters', () => {
    it('excludes raw audio from defaults (D-11)', () => {
        expect(defaultFiltersExcludeAudio()).toBe(true)
        expect(DEFAULT_DEBUG_FILTERS).not.toContain('audio')
        expect(createDefaultDebugFilters().has('audio')).toBe(false)
    })

    it('includes transcript, function, response, session, error, vad', () => {
        expect([...DEFAULT_DEBUG_FILTERS].sort()).toEqual(
            ['error', 'function', 'response', 'session', 'transcript', 'vad'].sort()
        )
    })
})
