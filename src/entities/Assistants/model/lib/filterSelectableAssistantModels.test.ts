import { filterSelectableAssistantModels } from './filterSelectableAssistantModels'

const published = { name: 'gpt-realtime', publish: true }
const draft = { name: 'yandex-internal', publish: false }
const unnamedDraft = { name: 'qwen-beta' }

describe('filterSelectableAssistantModels', () => {
    it('returns only published models for a regular user', () => {
        expect(filterSelectableAssistantModels([published, draft], false)).toEqual([published])
    })

    it('returns the full catalog for an admin', () => {
        expect(filterSelectableAssistantModels([published, draft], true)).toEqual([published, draft])
    })

    it('keeps the currently selected unpublished model for a regular user', () => {
        expect(
            filterSelectableAssistantModels([published, draft], false, 'yandex-internal'),
        ).toEqual([published, draft])
    })

    it('treats missing publish as unpublished', () => {
        expect(filterSelectableAssistantModels([published, unnamedDraft], false)).toEqual([published])
    })

    it('treats numeric 1 as published', () => {
        expect(filterSelectableAssistantModels([{ name: 'gpt', publish: 1 }], false)).toEqual([
            { name: 'gpt', publish: 1 },
        ])
    })

    it('returns an empty list when catalog is missing', () => {
        expect(filterSelectableAssistantModels(undefined, false)).toEqual([])
        expect(filterSelectableAssistantModels(null, true)).toEqual([])
    })
})
