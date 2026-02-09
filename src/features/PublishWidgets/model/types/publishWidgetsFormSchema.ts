import { WidgetAppearanceSettings } from '@/entities/WidgetKeys'
import { AssistantOptions } from '@/entities/Assistants'
import { PbxServerOptions } from '@/entities/PbxServers'

export interface PublishWidgetsFormSchema {
    name: string
    selectedAssistant: AssistantOptions | null
    selectedPbxServer: PbxServerOptions | null
    allowedDomains: string // Changed from string[] to string for direct textarea input
    maxConcurrentSessions: number
    maxSessionDuration: number
    isActive: boolean
    userId: string
    appearance: WidgetAppearanceSettings
    isLoading: boolean
    error?: string
}
