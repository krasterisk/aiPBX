export interface WidgetKey {
    id: number
    publicKey: string // "wk_xxxxx"
    name: string
    userId: number
    assistantId: number
    allowedDomains: string // JSON: '["example.com"]'
    maxConcurrentSessions: number
    isActive: boolean
    createdAt: string
    assistant?: {
        id: number
        name: string
        voice: string
    }
}

export interface CreateWidgetDto {
    name: string
    assistantId: number
    allowedDomains: string // JSON string array
    maxConcurrentSessions?: number
}

export interface UpdateWidgetDto {
    name?: string
    assistantId?: number
    allowedDomains?: string // JSON string array
    maxConcurrentSessions?: number
    isActive?: boolean
}

export interface WidgetAppearanceSettings {
    buttonPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    buttonColor: string
    theme: 'light' | 'dark' | 'auto'
    primaryColor: string
    accentColor: string
    language: 'en' | 'ru' | 'es' | 'de' | 'zh'
    showBranding: boolean
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
