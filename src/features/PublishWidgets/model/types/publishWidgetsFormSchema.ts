import { WidgetAppearanceSettings } from '@/entities/WidgetKeys'
import { AssistantOptions } from '@/entities/Assistants'

export interface PublishWidgetsFormSchema {
    name: string
    selectedAssistant: AssistantOptions | null
    allowedDomains: string[]
    maxConcurrentSessions: number
    appearance: WidgetAppearanceSettings
    isLoading: boolean
    error?: string
}
