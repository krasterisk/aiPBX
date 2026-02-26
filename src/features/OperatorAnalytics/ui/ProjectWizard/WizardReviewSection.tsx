import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Card } from '@/shared/ui/redesigned/Card'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import {
    MetricDefinition,
    DefaultMetricKey,
    WebhookEvent,
    projectWizardActions,
    getWizardCustomMetrics,
    getWizardSystemPrompt,
    getWizardVisibleDefaultMetrics,
    getWizardWebhookUrl,
    getWizardWebhookHeaders,
    getWizardWebhookEvents,
    getWizardShowWebhooks,
} from '@/entities/Report'
import { WizardStep2_MetricBuilder } from './WizardStep2_MetricBuilder'
import { WizardStep3_DefaultMetrics } from './WizardStep3_DefaultMetrics'
import { WizardStep4_Webhook } from './WizardStep4_Webhook'
import cls from './ProjectWizard.module.scss'

export const WizardReviewSection = memo(() => {
    const { t } = useTranslation('reports')
    const dispatch = useAppDispatch()

    const customMetrics = useSelector(getWizardCustomMetrics)
    const systemPrompt = useSelector(getWizardSystemPrompt)
    const visibleDefaults = useSelector(getWizardVisibleDefaultMetrics)
    const webhookUrl = useSelector(getWizardWebhookUrl)
    const webhookHeaders = useSelector(getWizardWebhookHeaders)
    const webhookEvents = useSelector(getWizardWebhookEvents)
    const showWebhooks = useSelector(getWizardShowWebhooks)

    const [showCustom, setShowCustom] = useState(false)
    const [showDefault, setShowDefault] = useState(false)

    return (
        <VStack gap={'16'} max>
            {/* Custom Metrics — collapsible */}
            <Card variant={'glass'} border={'partial'} padding={'16'} max>
                <VStack gap={'8'} max>
                    <HStack max justify={'between'} align={'center'}
                        onClick={() => setShowCustom(prev => !prev)}
                        className={cls.clickable}>
                        <Text text={String(t('Кастомные метрики'))} bold />
                        <Text text={showCustom ? '▲' : '▼'} />
                    </HStack>
                    {showCustom && (
                        <WizardStep2_MetricBuilder
                            metrics={customMetrics}
                            systemPrompt={systemPrompt}
                            visibleDefaultMetrics={visibleDefaults}
                            onChangeMetrics={(m: MetricDefinition[]) => dispatch(projectWizardActions.setCustomMetrics(m))}
                        />
                    )}
                </VStack>
            </Card>

            {/* Default Metrics — collapsible */}
            <Card variant={'glass'} border={'partial'} padding={'16'} max>
                <VStack gap={'8'} max>
                    <HStack max justify={'between'} align={'center'}
                        onClick={() => setShowDefault(prev => !prev)}
                        className={cls.clickable}>
                        <Text text={String(t('Стандартные метрики'))} bold />
                        <Text text={showDefault ? '▲' : '▼'} />
                    </HStack>
                    {showDefault && (
                        <WizardStep3_DefaultMetrics
                            visibleMetrics={visibleDefaults}
                            onToggle={(key: DefaultMetricKey) => dispatch(projectWizardActions.toggleDefaultMetric(key))}
                        />
                    )}
                </VStack>
            </Card>

            {/* Webhooks — collapsible */}
            <Card variant={'glass'} border={'partial'} padding={'16'} max>
                <VStack gap={'8'} max>
                    <HStack max justify={'between'} align={'center'}
                        onClick={() => dispatch(projectWizardActions.setShowWebhooks(!showWebhooks))}
                        className={cls.clickable}>
                        <Text text={String(t('Webhooks (опционально)'))} bold />
                        <Text text={showWebhooks ? '▲' : '▼'} />
                    </HStack>
                    {showWebhooks && (
                        <WizardStep4_Webhook
                            webhookUrl={webhookUrl}
                            webhookHeaders={webhookHeaders}
                            webhookEvents={webhookEvents}
                            onChangeUrl={(v: string) => dispatch(projectWizardActions.setWebhookUrl(v))}
                            onChangeHeaders={(v: Record<string, string>) => dispatch(projectWizardActions.setWebhookHeaders(v))}
                            onChangeEvents={(v: WebhookEvent[]) => dispatch(projectWizardActions.setWebhookEvents(v))}
                        />
                    )}
                </VStack>
            </Card>
        </VStack>
    )
})
