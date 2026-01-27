import { Assistant } from '@/entities/Assistants'

export interface PlaygroundAssistantFormSchema {
    data: Partial<Assistant> | null
    isLoading: boolean
    error?: string
}
