export interface DocSection {
    id: string
    titleKey: string
    subsections?: Array<{
        id: string
        titleKey: string
        anchor?: string
    }>
}

/** Sidebar structure mirrors app menubar (non-admin sections). */
export const DOC_SECTIONS: DocSection[] = [
    {
        id: 'getting-started',
        titleKey: 'doc_getting_started'
    },
    {
        id: 'dashboards',
        titleKey: 'doc_dashboards',
        subsections: [
            { id: 'dashboards', titleKey: 'doc_dashboards_summary', anchor: 'сводный-дашборд' },
            { id: 'dashboards', titleKey: 'doc_dashboards_bots', anchor: 'аналитика-ботов' },
            { id: 'dashboards', titleKey: 'doc_dashboards_calls', anchor: 'аналитика-звонков' }
        ]
    },
    {
        id: 'calls',
        titleKey: 'doc_calls'
    },
    {
        id: 'ai-bots',
        titleKey: 'doc_ai_bots',
        subsections: [
            { id: 'assistants', titleKey: 'doc_assistants', anchor: 'создание-ассистента' },
            { id: 'playground', titleKey: 'doc_playground', anchor: 'как-провести-тест' },
            { id: 'tools', titleKey: 'doc_tools', anchor: 'типы-функций' },
            { id: 'mcp-servers', titleKey: 'doc_mcp', anchor: 'галерея-интеграций-composio' },
            { id: 'knowledge-bases', titleKey: 'doc_knowledge_bases' },
            { id: 'publish-sip', titleKey: 'doc_publish_sip', anchor: 'sips-voip-интеграция' },
            { id: 'publish-trunks', titleKey: 'doc_publish_trunks', anchor: 'sip-trunks' },
            { id: 'publish-widgets', titleKey: 'doc_publish_widgets', anchor: 'виджеты-webrtc-для-сайта' }
        ]
    },
    {
        id: 'analytics',
        titleKey: 'doc_analytics',
        subsections: [
            { id: 'analytics-projects', titleKey: 'doc_analytics_projects', anchor: 'проекты-аналитики' },
            { id: 'analytics-api', titleKey: 'doc_analytics_api', anchor: 'api-аналитики' }
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

const SECTION_FILES: Record<string, string> = {
    'getting-started': '01-getting-started.md',
    assistants: '02-assistants.md',
    tools: '03-tools.md',
    'mcp-servers': '04-mcp-servers.md',
    playground: '05-playground.md',
    dashboards: '06-dashboards.md',
    'publish-sip': '07-publish.md',
    'publish-trunks': '07-publish.md',
    'publish-widgets': '07-publish.md',
    publish: '07-publish.md',
    payments: '08-payments.md',
    calls: '09-calls.md',
    'knowledge-bases': '10-knowledge-bases.md',
    analytics: '11-operator-analytics.md',
    'analytics-projects': '11-operator-analytics.md',
    'analytics-api': '11-operator-analytics.md',
    'ai-bots': '02-assistants.md'
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
        if (lang !== 'ru') {
            return await fetchDocumentationMarkdown(sectionId, 'ru')
        }
        return '# Ошибка загрузки\n\nНе удалось загрузить документацию. Попробуйте обновить страницу.'
    }
}
