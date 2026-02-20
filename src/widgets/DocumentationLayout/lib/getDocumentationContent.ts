export interface DocSection {
    id: string
    titleKey: string
    subsections?: Array<{
        id: string
        titleKey: string
        anchor?: string
    }>
}

export const DOC_SECTIONS: DocSection[] = [
    {
        id: 'getting-started',
        titleKey: 'doc_getting_started'
    },
    {
        id: 'assistants',
        titleKey: 'doc_assistants',
        subsections: [
            { id: 'assistants', titleKey: 'doc_assistants_create', anchor: 'создание-ассистента' },
            { id: 'assistants', titleKey: 'doc_assistants_prompt', anchor: 'инструкция-промпт-сердце-ассистента' },
            { id: 'assistants', titleKey: 'doc_assistants_models', anchor: 'модель-ии-какую-выбрать' },
            { id: 'assistants', titleKey: 'doc_assistants_voices', anchor: 'голос-как-звучит-ваш-ассистент' },
            { id: 'assistants', titleKey: 'doc_assistants_params', anchor: 'параметры-модели-и-vad' },
            { id: 'assistants', titleKey: 'doc_assistants_prompts_guide', anchor: 'гайд-по-написанию-промптов' }
        ]
    },
    {
        id: 'tools',
        titleKey: 'doc_tools',
        subsections: [
            { id: 'tools', titleKey: 'doc_tools_types', anchor: 'типы-функций' },
            { id: 'tools', titleKey: 'doc_tools_create', anchor: 'создание-функции' },
            { id: 'tools', titleKey: 'doc_tools_schema', anchor: 'json-схема-параметров' },
            { id: 'tools', titleKey: 'doc_tools_auth', anchor: 'аутентификация' },
            { id: 'tools', titleKey: 'doc_tools_examples', anchor: 'примеры-function-calling' }
        ]
    },
    {
        id: 'mcp-servers',
        titleKey: 'doc_mcp',
        subsections: [
            { id: 'mcp-servers', titleKey: 'doc_mcp_composio', anchor: 'галерея-интеграций-composio' },
            { id: 'mcp-servers', titleKey: 'doc_mcp_manual', anchor: 'подключение-mcp-сервера' },
            { id: 'mcp-servers', titleKey: 'doc_mcp_tools', anchor: 'управление-инструментами' }
        ]
    },
    {
        id: 'playground',
        titleKey: 'doc_playground',
        subsections: [
            { id: 'playground', titleKey: 'doc_playground_testing', anchor: 'как-провести-тест' },
            { id: 'playground', titleKey: 'doc_playground_logs', anchor: 'чтение-логов-и-отладка' },
            { id: 'playground', titleKey: 'doc_playground_scenarios', anchor: 'сценарии-использования' }
        ]
    },
    {
        id: 'dashboards',
        titleKey: 'doc_dashboards',
        subsections: [
            { id: 'dashboards', titleKey: 'doc_dashboards_overview', anchor: 'overview-обзорная-панель' },
            { id: 'dashboards', titleKey: 'doc_dashboards_analytics', anchor: 'ai-analytics-аналитика-по-звонкам' },
            { id: 'dashboards', titleKey: 'doc_dashboards_records', anchor: 'call-records-история-звонков' }
        ]
    },
    {
        id: 'publish',
        titleKey: 'doc_publish',
        subsections: [
            { id: 'publish', titleKey: 'doc_publish_sip', anchor: 'sips-voip-интеграция' },
            { id: 'publish', titleKey: 'doc_publish_widgets', anchor: 'виджеты-webrtc-для-сайта' },
            { id: 'publish', titleKey: 'doc_publish_pbx', anchor: 'pbxs-подключение-asterisk' },
            { id: 'publish', titleKey: 'doc_publish_asterisk', anchor: 'настройка-asterisk' }
        ]
    },
    {
        id: 'payments',
        titleKey: 'doc_payments',
        subsections: [
            { id: 'payments', titleKey: 'doc_payments_balance', anchor: 'обзор-баланса' },
            { id: 'payments', titleKey: 'doc_payments_topup', anchor: 'пополнение-баланса' },
            { id: 'payments', titleKey: 'doc_payments_limits', anchor: 'лимиты-и-уведомления' },
            { id: 'payments', titleKey: 'doc_payments_history', anchor: 'история-платежей' },
            { id: 'payments', titleKey: 'doc_payments_orgs', anchor: 'организации-юрлица' }
        ]
    }
]

// Map section id → markdown filename
const SECTION_FILES: Record<string, string> = {
    'getting-started': '01-getting-started.md',
    assistants: '02-assistants.md',
    tools: '03-tools.md',
    'mcp-servers': '04-mcp-servers.md',
    playground: '05-playground.md',
    dashboards: '06-dashboards.md',
    publish: '07-publish.md',
    payments: '08-payments.md'
}

const cache: Record<string, string> = {}

export async function fetchDocumentationMarkdown (sectionId: string, lang: string = 'ru'): Promise<string> {
    const fileName = SECTION_FILES[sectionId]
    if (!fileName) {
        return '# Раздел не найден\n\nВыберите раздел из бокового меню.'
    }

    const cacheKey = `${lang}:${sectionId}`
    if (cache[cacheKey]) {
        return cache[cacheKey]
    }

    try {
        const response = await fetch(`/docs/${lang}/${fileName}`)
        if (!response.ok) {
            // Fallback to Russian if translation not available
            if (lang !== 'ru') {
                return await fetchDocumentationMarkdown(sectionId, 'ru')
            }
            throw new Error(`HTTP ${response.status}`)
        }
        const text = await response.text()
        cache[cacheKey] = text
        return text
    } catch (error) {
        console.error(`Failed to load doc: ${lang}/${fileName}`, error)
        // Try Russian fallback on error
        if (lang !== 'ru') {
            return await fetchDocumentationMarkdown(sectionId, 'ru')
        }
        return '# Ошибка загрузки\n\nНе удалось загрузить документацию. Попробуйте обновить страницу.'
    }
}
