import fs from 'fs'
import path from 'path'

type LocaleId = 'ru' | 'en' | 'de' | 'zh'

const LOCALES: LocaleId[] = ['ru', 'en', 'de', 'zh']

/** Phase 10 user-visible keys in the reports namespace (Russian source string is the key). */
export const PHASE_10_REPORT_KEYS = [
    // Panel chrome
    'Почему такая оценка',
    'Разбор темы',
    'Назад к {{context}}',
    'Закрыть панель',
    // Section subtitles and «Темы» section
    'Темы',
    'Нажмите на оператора, чтобы увидеть, из чего сложилась оценка',
    'Нажмите на тему, чтобы увидеть её звонки и статистику',
    'Темы звонков не настроены',
    'Добавьте темы и ключевые слова в настройках проекта — звонки начнут размечаться при следующем анализе.',
    'Настроить темы проекта',
    'Совпадений по темам нет',
    'За выбранный период ни один звонок не совпал со словарём тем. Измените период или дополните синонимы темы.',
    'Показать все ({{count}})',
    'TOPICS_CALL_LIST_HEADER',
    'TOPICS_PAGE_INDICATOR',
    'TOPICS_SHARE_OF_PERIOD',
    'TOPICS_DELTA_VS_PERIOD',
    'Средний балл',
    // Operator panel body
    'Нет обоснований по метрикам',
    'В звонках за этот период анализ не оставил цитат и пояснений. Попробуйте расширить период.',
    'По последним {{count}} звонкам',
    'Звонков за период нет',
    // Panel error state
    'Не удалось загрузить разбор',
    'Проверьте соединение и повторите. Если ошибка повторяется, обновите страницу.',
    'Повторить',
    // Tag chips and call-card editing
    'Темы не найдены',
    'Убрать тему {{name}}',
    '+{{count}}',
    '+ Добавить тему',
    'Изменить темы',
    'Готово',
    'Теги',
    'Не удалось сохранить теги. Изменения не применены.',
    // Taxonomy editor
    'Темы звонков',
    'Добавить тему',
    'Новая тема',
    'Название темы',
    'Ключевые слова (через запятую)',
    'Добавьте темы и ключевые слова — звонки начнут размечаться при следующем анализе.',
    'Темы — метки для звонков. При анализе система ищет в расшифровке ключевые слова темы и ставит метку автоматически.',
    'TAXONOMY_NAME_HINT',
    'TAXONOMY_KEYWORDS_HINT',
    'TAXONOMY_KEYWORDS_PLACEHOLDER',
    'Удалить тему «{{name}}»?',
    'Звонки, размеченные ранее, сохранят тег. Новые анализы перестанут его получать.',
    'Удалить тему',
    'Отмена',
] as const

/** English copy per 10-UI-SPEC.md § Copywriting Contract */
const ENGLISH_CONTRACT: Partial<Record<(typeof PHASE_10_REPORT_KEYS)[number], string>> = {
    'Почему такая оценка': 'Why this score',
    'Разбор темы': 'Break down topic',
    'Назад к {{context}}': 'Back to {{context}}',
    'Закрыть панель': 'Close panel',
    'Убрать тему {{name}}': 'Remove topic {{name}}',
    'Темы звонков не настроены': "Call topics aren't set up",
    'Добавьте темы и ключевые слова в настройках проекта — звонки начнут размечаться при следующем анализе.':
        'Add topics and their keywords in project settings — calls will be tagged from the next analysis onward.',
    'Настроить темы проекта': 'Set up project topics',
    'Совпадений по темам нет': 'No topic matches',
    'За выбранный период ни один звонок не совпал со словарём тем. Измените период или дополните синонимы темы.':
        'No call in the selected period matched the topic dictionary. Change the period or add more synonyms.',
    'Нет обоснований по метрикам': 'No metric evidence',
    'В звонках за этот период анализ не оставил цитат и пояснений. Попробуйте расширить период.':
        'Analysis left no quotes or rationales for calls in this period. Try widening the period.',
    'Звонков за период нет': 'No calls in this period',
    'Темы не найдены': 'No topics found',
    'Не удалось загрузить разбор': "Couldn't load the breakdown",
    'Проверьте соединение и повторите. Если ошибка повторяется, обновите страницу.':
        'Check your connection and retry. If it keeps failing, reload the page.',
    Повторить: 'Retry',
    'Не удалось сохранить теги. Изменения не применены.': "Couldn't save tags. Your changes weren't applied.",
    'По последним {{count}} звонкам': 'Based on the last {{count}} calls',
    'Удалить тему «{{name}}»?': 'Delete topic "{{name}}"?',
    'Звонки, размеченные ранее, сохранят тег. Новые анализы перестанут его получать.':
        'Previously tagged calls keep the tag. New analyses will stop receiving it.',
    'Удалить тему': 'Delete topic',
    Отмена: 'Cancel',
    'Нажмите на оператора, чтобы увидеть, из чего сложилась оценка':
        'Select an operator to see what the score is made of',
    'Нажмите на тему, чтобы увидеть её звонки и статистику':
        'Select a topic to see its calls and statistics',
}

const localesDir = path.resolve(__dirname, '../../../../public/locales')

const loadNamespace = (locale: LocaleId): Record<string, string> => {
    const filePath = path.join(localesDir, locale, 'reports.json')
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw) as Record<string, string>
}

const extractPlaceholders = (value: string): string[] => {
    const matches = value.match(/\{\{(\w+)\}\}/g) ?? []
    return matches.map(token => token.slice(2, -2)).sort()
}

describe('reports locale parity — phase 10', () => {
    const namespaces = Object.fromEntries(
        LOCALES.map(locale => [locale, loadNamespace(locale)]),
    ) as Record<LocaleId, Record<string, string>>

    it('covers a non-empty explicit phase key list', () => {
        expect(PHASE_10_REPORT_KEYS.length).toBeGreaterThan(30)
    })

    it.each(LOCALES)('parses %s reports.json as valid JSON object', (locale) => {
        expect(typeof namespaces[locale]).toBe('object')
        expect(Array.isArray(namespaces[locale])).toBe(false)
    })

    it.each(PHASE_10_REPORT_KEYS.flatMap(key =>
        LOCALES.map(locale => ({ key, locale })),
    ))('resolves key "$key" in locale $locale', ({ key, locale }) => {
        const value = namespaces[locale][key]
        expect(value).toBeDefined()
        expect(typeof value).toBe('string')
        expect(value.trim().length).toBeGreaterThan(0)
    })

    it.each(PHASE_10_REPORT_KEYS.filter(key => key.includes('{{')))(
        'keeps identical interpolation placeholders for "%s" across all locales',
        (key) => {
            const ruPlaceholders = extractPlaceholders(namespaces.ru[key])
            for (const locale of LOCALES) {
                expect(extractPlaceholders(namespaces[locale][key])).toEqual(ruPlaceholders)
            }
        },
    )

    it.each(Object.entries(ENGLISH_CONTRACT))(
        'matches the English design contract for "%s"',
        (key, expected) => {
            expect(namespaces.en[key]).toBe(expected)
        },
    )
})
