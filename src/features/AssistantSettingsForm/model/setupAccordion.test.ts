import {
    DEFAULT_SETUP_SECTION,
    SETUP_SECTIONS,
    resolveExclusiveExpand,
} from './setupAccordion'

describe('AssistantSettingsForm exclusive accordion (D-31, D-08)', () => {
    it('defaults expanded key to prompt', () => {
        expect(DEFAULT_SETUP_SECTION).toBe('prompt')
    })

    it('places Tools second after Prompt', () => {
        expect(SETUP_SECTIONS).toEqual(['prompt', 'tools', 'parameters', 'vad'])
    })

    it('expands only the requested panel (exclusive)', () => {
        expect(resolveExclusiveExpand('prompt', 'parameters', true)).toBe('parameters')
        expect(resolveExclusiveExpand('parameters', 'parameters', false)).toBe(false)
        expect(resolveExclusiveExpand(false, 'vad', true)).toBe('vad')
        expect(resolveExclusiveExpand('vad', 'tools', true)).toBe('tools')
    })
})
