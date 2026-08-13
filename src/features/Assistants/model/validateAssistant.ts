import type { Assistant } from '@/entities/Assistants'

export type AssistantRequiredField = 'name' | 'instruction' | 'model' | 'voice'
export type AssistantFieldSection = 'prompt' | 'parameters'

export interface AssistantFieldError {
    field: AssistantRequiredField
    section: AssistantFieldSection
    messageKey: string
}

const isBlank = (value: string | null | undefined): boolean =>
    !value?.trim()

export function getAssistantValidationError (
    data: Assistant | null | undefined,
): AssistantFieldError | null {
    if (!data || isBlank(data.name)) {
        return {
            field: 'name',
            section: 'parameters',
            messageKey: 'Заполните наименование ассистента',
        }
    }

    if (isBlank(data.instruction)) {
        return {
            field: 'instruction',
            section: 'prompt',
            messageKey: 'Заполните инструкцию для ассистента',
        }
    }

    const isNonRealtime = data.pipelineMode === 'non-realtime'
    if (!isNonRealtime) {
        if (isBlank(data.model)) {
            return {
                field: 'model',
                section: 'parameters',
                messageKey: 'Выберите модель',
            }
        }
        if (isBlank(data.voice)) {
            return {
                field: 'voice',
                section: 'parameters',
                messageKey: 'Выберите голос',
            }
        }
    }

    return null
}
