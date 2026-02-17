export interface WidgetKey {
    id: number
    publicKey: string // "wk_xxxxx"
    name: string
    userId: number
    assistantId: number
    pbxServerId?: number
    allowedDomains: string // JSON: '["example.com"]'
    maxConcurrentSessions: number
    maxSessionDuration: number
    isActive: boolean
    appearance?: string // JSON string of WidgetAppearanceSettings
    language?: string
    logo?: string
    createdAt: string
    assistant?: {
        id: number
        name: string
        voice: string
    }
    pbxServer?: {
        id: number
        name: string
        uniqueId?: string
    }
    user?: {
        id: number
        name?: string
        email?: string
    }
    apiUrl?: string
    token?: string
}

export interface CreateWidgetDto {
    name: string
    assistantId: number
    pbxServerId?: number
    allowedDomains: string // JSON string array
    maxConcurrentSessions?: number
    maxSessionDuration?: number
    appearance?: string
    language?: string
    logo?: string
    apiUrl?: string
}

export interface UpdateWidgetDto {
    name?: string
    assistantId?: number
    pbxServerId?: number
    allowedDomains?: string // JSON string array
    maxConcurrentSessions?: number
    maxSessionDuration?: number
    isActive?: boolean
    appearance?: string
    language?: string
    logo?: string
    apiUrl?: string
}

export interface WidgetAppearanceSettings {
    buttonPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    buttonColor: string
    theme: 'light' | 'dark' | 'auto'
    primaryColor: string
    accentColor: string
    language: 'en' | 'ru' | 'es' | 'de' | 'zh'
    showBranding: boolean
    logo?: string
}

export const DEFAULT_APPEARANCE_SETTINGS: WidgetAppearanceSettings = {
    buttonPosition: 'bottom-right',
    buttonColor: '#667eea',
    theme: 'light',
    primaryColor: '#667eea',
    accentColor: '#764ba2',
    language: 'en',
    showBranding: true
}
