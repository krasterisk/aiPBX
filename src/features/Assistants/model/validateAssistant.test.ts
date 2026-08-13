import { initAssistant } from '@/entities/Assistants'
import { getAssistantValidationError } from './validateAssistant'

const valid = {
    ...initAssistant,
    name: 'Support bot',
    instruction: 'Be helpful',
}

describe('getAssistantValidationError', () => {
    it('returns null when required fields are filled', () => {
        expect(getAssistantValidationError(valid)).toBeNull()
    })

    it('points at name in parameters when name is empty', () => {
        expect(getAssistantValidationError({ ...valid, name: '' })).toEqual({
            field: 'name',
            section: 'parameters',
            messageKey: 'Заполните наименование ассистента',
        })
    })

    it('treats whitespace-only name as empty', () => {
        expect(getAssistantValidationError({ ...valid, name: '   ' })?.field).toBe('name')
    })

    it('points at instruction in prompt when instruction is empty', () => {
        expect(getAssistantValidationError({ ...valid, instruction: '' })).toEqual({
            field: 'instruction',
            section: 'prompt',
            messageKey: 'Заполните инструкцию для ассистента',
        })
    })

    it('prefers name over instruction when both are empty', () => {
        expect(getAssistantValidationError({ ...valid, name: '', instruction: '' })?.field).toBe('name')
    })

    it('points at model in parameters when model is empty (realtime)', () => {
        expect(getAssistantValidationError({ ...valid, model: '' })).toEqual({
            field: 'model',
            section: 'parameters',
            messageKey: 'Выберите модель',
        })
    })

    it('points at voice in parameters when voice is empty (realtime)', () => {
        expect(getAssistantValidationError({ ...valid, voice: '' })).toEqual({
            field: 'voice',
            section: 'parameters',
            messageKey: 'Выберите голос',
        })
    })

    it('does not require model or voice in non-realtime pipeline', () => {
        expect(getAssistantValidationError({
            ...valid,
            pipelineMode: 'non-realtime',
            model: '',
            voice: '',
        })).toBeNull()
    })

    it('returns name error when data is missing', () => {
        expect(getAssistantValidationError(null)?.field).toBe('name')
        expect(getAssistantValidationError(undefined)?.field).toBe('name')
    })
})
