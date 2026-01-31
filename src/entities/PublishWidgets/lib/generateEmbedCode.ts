import { WidgetKey, WidgetAppearanceSettings } from '@/entities/WidgetKeys'

export function generateEmbedCode(
    widget: WidgetKey,
    settings: WidgetAppearanceSettings,
    wssUrl: string
): string {
    const attributes = [
        `src="https://cdn.jsdelivr.net/gh/krasterisk/aipbx_widget@latest/dist/widget.min.js"`,
        `data-key="${widget.publicKey}"`,
        `data-api="${__API__}"`,
        `data-wss="${wssUrl}"`
    ]

    // Добавляем опциональные атрибуты только если они отличаются от defaults
    if (settings.buttonPosition !== 'bottom-right') {
        attributes.push(`data-position="${settings.buttonPosition}"`)
    }

    if (settings.theme !== 'light') {
        attributes.push(`data-theme="${settings.theme}"`)
    }

    if (settings.primaryColor !== '#667eea') {
        attributes.push(`data-primary-color="${settings.primaryColor}"`)
    }

    if (settings.accentColor !== '#764ba2') {
        attributes.push(`data-accent-color="${settings.accentColor}"`)
    }

    if (settings.language !== 'en') {
        attributes.push(`data-language="${settings.language}"`)
    }

    if (!settings.showBranding) {
        attributes.push(`data-hide-branding="true"`)
    }

    if (settings.buttonColor !== '#667eea') {
        attributes.push(`data-button-color="${settings.buttonColor}"`)
    }

    return `<!-- AI PBX Voice Widget -->
<script 
    ${attributes.join('\n    ')}
></script>`
}
