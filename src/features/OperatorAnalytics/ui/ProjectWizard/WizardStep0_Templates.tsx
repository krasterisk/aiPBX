import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Card } from '@/shared/ui/redesigned/Card'
import { ProjectTemplate } from '@/entities/Report'
import cls from './ProjectWizard.module.scss'

const TEMPLATES: ProjectTemplate[] = [
    {
        id: 'real_estate',
        name: 'Недвижимость',
        description: 'Анализ звонков агентств недвижимости',
        icon: '🏠',
        systemPrompt: 'Контекст: агентство недвижимости. Операторы обрабатывают входящие звонки от потенциальных покупателей и арендаторов.',
        customMetricsSchema: [
            { id: 'property_match', name: 'Подбор объекта', type: 'boolean', description: 'Предложил ли оператор подходящий объект недвижимости' },
            { id: 'viewing_scheduled', name: 'Просмотр назначен', type: 'boolean', description: 'Был ли назначен просмотр объекта' },
        ],
        visibleDefaultMetrics: ['greeting_quality', 'objection_handling', 'closing_quality', 'product_knowledge'],
    },
    {
        id: 'delivery',
        name: 'Доставка',
        description: 'Анализ звонков служб доставки',
        icon: '🚚',
        systemPrompt: 'Контекст: служба доставки. Операторы обрабатывают заказы и решают проблемы с доставкой.',
        customMetricsSchema: [
            { id: 'upsell_attempt', name: 'Попытка апселла', type: 'boolean', description: 'Предложил ли оператор дополнительные товары или услуги' },
            { id: 'delivery_issue_resolved', name: 'Проблема решена', type: 'boolean', description: 'Была ли решена проблема с доставкой' },
        ],
        visibleDefaultMetrics: ['greeting_quality', 'problem_resolution', 'active_listening', 'politeness_empathy'],
    },
    {
        id: 'tech_support',
        name: 'Техподдержка',
        description: 'Анализ звонков технической поддержки',
        icon: '🔧',
        systemPrompt: 'Контекст: техническая поддержка. Операторы помогают пользователям решить технические проблемы.',
        customMetricsSchema: [
            { id: 'issue_category', name: 'Категория проблемы', type: 'enum', description: 'Категория технической проблемы', enumValues: ['Софт', 'Железо', 'Сеть', 'Другое'] },
            { id: 'first_call_resolution', name: 'Решено с первого звонка', type: 'boolean', description: 'Была ли проблема решена за один звонок' },
        ],
        visibleDefaultMetrics: ['problem_resolution', 'product_knowledge', 'active_listening', 'speech_clarity_pace'],
    },
    {
        id: 'banking',
        name: 'Банк',
        description: 'Анализ звонков банковских контакт-центров',
        icon: '🏦',
        systemPrompt: 'Контекст: банковский контакт-центр. Операторы консультируют клиентов по продуктам и услугам банка.',
        customMetricsSchema: [
            { id: 'product_offered', name: 'Продукт предложен', type: 'boolean', description: 'Был ли предложен банковский продукт клиенту' },
            { id: 'compliance_check', name: 'Комплаенс', type: 'boolean', description: 'Соблюдал ли оператор требования комплаенса' },
        ],
        visibleDefaultMetrics: ['script_compliance', 'politeness_empathy', 'product_knowledge', 'closing_quality'],
    },
    {
        id: 'custom',
        name: 'Свой шаблон',
        description: 'Создать проект с нуля',
        icon: '✨',
        systemPrompt: '',
        customMetricsSchema: [],
        visibleDefaultMetrics: ['greeting_quality', 'script_compliance', 'politeness_empathy', 'active_listening', 'objection_handling', 'product_knowledge', 'problem_resolution', 'speech_clarity_pace', 'closing_quality'],
    },
]

interface WizardStep0Props {
    selectedTemplateId?: string
    onSelect: (template: ProjectTemplate) => void
}

export const WizardStep0_Templates = memo(({ selectedTemplateId, onSelect }: WizardStep0Props) => {
    const { t } = useTranslation('reports')

    const handleSelect = useCallback((tpl: ProjectTemplate) => {
        onSelect(tpl)
    }, [onSelect])

    return (
        <VStack gap={'16'} max>
            <Text title={String(t('Выберите шаблон'))} bold />
            <Text text={String(t('Шаблон предзаполнит настройки проекта'))} />
            <div className={cls.templateGrid}>
                {TEMPLATES.map(tpl => (
                    <Card
                        key={tpl.id}
                        variant={'glass'}
                        border={'partial'}
                        padding={'16'}
                        className={`${cls.templateCard} ${selectedTemplateId === tpl.id ? cls.selected : ''}`}
                        onClick={() => handleSelect(tpl)}
                    >
                        <VStack gap={'8'} align={'center'}>
                            <span className={cls.templateIcon}>{tpl.icon}</span>
                            <Text text={String(t(tpl.name))} bold />
                            <Text text={String(t(tpl.description))} size={'s'} />
                        </VStack>
                    </Card>
                ))}
            </div>
        </VStack>
    )
})
