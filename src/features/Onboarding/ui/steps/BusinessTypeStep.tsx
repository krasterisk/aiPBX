import React, { memo, useCallback, useEffect, useState } from 'react'
import cls from '../OnboardingWizard/OnboardingWizard.module.scss'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/redesigned/Button'
import { Text } from '@/shared/ui/redesigned/Text'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Input } from '@/shared/ui/mui/Input'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch'
import { useSelector } from 'react-redux'
import { onboardingActions } from '../../model/slices/onboardingSlice'
import {
    getOnboardingTemplateId,
    getOnboardingCustomDescription,
    getOnboardingCustomFeatures,
    getOnboardingIsGenerating,
    getOnboardingIsCreating,
    getOnboardingError
} from '../../model/selectors/onboardingSelectors'
import { BusinessCard } from '../components/BusinessCard/BusinessCard'
import { assistantTemplates, useSetAssistants, useGeneratePrompt, useUpdateAssistant } from '@/entities/Assistants'

import { useMcpServersAll } from '@/entities/Mcp'
import {
    Wrench,
    UtensilsCrossed,
    Stethoscope,
    Home,
    Building2,
    Car,
    Dumbbell,
    Scissors,
    PenLine,
    Check,
    ArrowLeft,
    Sparkles,
    Loader2,
    Plus,
    X
} from 'lucide-react'

interface BusinessTypeStepProps {
    className?: string
}

const businessCards = [
    { id: 'appliance_repair', Icon: Wrench, labelKey: 'business_repair' },
    { id: 'pizzeria', Icon: UtensilsCrossed, labelKey: 'business_pizza' },
    { id: 'dental_clinic', Icon: Stethoscope, labelKey: 'business_clinic' },
    { id: 'real_estate', Icon: Home, labelKey: 'business_realestate' },
    { id: 'hotel_reception', Icon: Building2, labelKey: 'business_hotel' },
    { id: 'auto_service', Icon: Car, labelKey: 'business_auto' },
    { id: 'fitness_club', Icon: Dumbbell, labelKey: 'business_fitness' },
    { id: 'beauty_salon', Icon: Scissors, labelKey: 'business_beauty' },
    { id: 'custom', Icon: PenLine, labelKey: 'business_custom' }
]

// Maps template IDs to their i18n feature key prefix
const templateFeatureKeys: Record<string, string> = {
    appliance_repair: 'repair',
    pizzeria: 'pizza',
    dental_clinic: 'clinic',
    real_estate: 'realestate',
    hotel_reception: 'hotel',
    auto_service: 'auto',
    fitness_club: 'fitness',
    beauty_salon: 'beauty'
}

const FEATURES_PER_TEMPLATE = 4

export const BusinessTypeStep = memo(({ className }: BusinessTypeStepProps) => {
    const { t, i18n } = useTranslation('onboarding')
    const dispatch = useAppDispatch()
    const selectedTemplate = useSelector(getOnboardingTemplateId)
    const customDescription = useSelector(getOnboardingCustomDescription)
    const customFeatures = useSelector(getOnboardingCustomFeatures)
    const isGenerating = useSelector(getOnboardingIsGenerating)
    const isCreating = useSelector(getOnboardingIsCreating)
    const error = useSelector(getOnboardingError)

    const [createAssistant] = useSetAssistants()
    const [generatePrompt] = useGeneratePrompt()
    const [updateAssistant] = useUpdateAssistant()
    const { refetch: refetchMcpServers } = useMcpServersAll(null)
    const [newFeature, setNewFeature] = useState('')

    const isCustom = selectedTemplate === 'custom'
    const isLoading = isGenerating || isCreating
    const hasFeatures = !isCustom && selectedTemplate && templateFeatureKeys[selectedTemplate]

    // When template changes, populate customFeatures with translated defaults
    useEffect(() => {
        if (!selectedTemplate || isCustom) return
        const prefix = templateFeatureKeys[selectedTemplate]
        if (!prefix) return

        const features: string[] = []
        for (let i = 1; i <= FEATURES_PER_TEMPLATE; i++) {
            features.push(t(`business_feature_${prefix}_${i}`))
        }
        dispatch(onboardingActions.setCustomFeatures(features))
    }, [selectedTemplate, isCustom, t, dispatch])

    const onSelectCard = useCallback((id: string) => {
        dispatch(onboardingActions.selectTemplate(id))
        dispatch(onboardingActions.setError(null))
    }, [dispatch])

    const onCustomDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        dispatch(onboardingActions.setCustomDescription(e.target.value))
    }, [dispatch])

    const onAddFeature = useCallback(() => {
        const trimmed = newFeature.trim()
        if (!trimmed) return
        dispatch(onboardingActions.addCustomFeature(trimmed))
        setNewFeature('')
    }, [newFeature, dispatch])

    const onRemoveFeature = useCallback((index: number) => {
        dispatch(onboardingActions.removeCustomFeature(index))
    }, [dispatch])

    const onFeatureKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            onAddFeature()
        }
    }, [onAddFeature])

    const onCreateFromTemplate = useCallback(async () => {
        if (!selectedTemplate || isCustom) return

        const template = assistantTemplates.find(t => t.id === selectedTemplate)
        if (!template) return

        dispatch(onboardingActions.setCreatingAssistant(true))
        dispatch(onboardingActions.setError(null))

        try {
            const locale = i18n.language || 'en'
            const prompt = template.prompts[locale] || template.prompts.en || Object.values(template.prompts)[0]
            const name = t(`business_${selectedTemplate === 'appliance_repair' ? 'repair' : selectedTemplate}`, selectedTemplate)

            // Append user-configured features to the prompt
            let finalPrompt = prompt
            if (customFeatures.length > 0) {
                const tasks = customFeatures.map(f => `- ${f}`).join('\n')
                finalPrompt += `\n\nAssistant tasks:\n${tasks}`
            }

            const result = await createAssistant([{
                name,
                instruction: finalPrompt,
                model: 'gpt-realtime-mini',
                voice: 'alloy',
                analytic: true,
                tools: []
            }]).unwrap()

            if (result?.[0]?.id) {
                const assistantId = result[0].id
                dispatch(onboardingActions.setCreatedAssistantId(assistantId))

                // Auto-attach existing Telegram MCP server
                try {
                    const { data: servers } = await refetchMcpServers()
                    const telegramServer = servers?.find(s => s.composioToolkit === 'telegram')
                    if (telegramServer) {
                        await updateAssistant({
                            id: assistantId,
                            mcpServers: [telegramServer]
                        }).unwrap()
                    }
                } catch {
                    // Non-critical: user can attach MCP server manually later
                }

                dispatch(onboardingActions.nextStep())
            }
        } catch (err: any) {
            dispatch(onboardingActions.setError(err?.data?.message || 'Error creating assistant'))
            dispatch(onboardingActions.setCreatingAssistant(false))
        }
    }, [selectedTemplate, isCustom, dispatch, createAssistant, i18n.language, t, customFeatures, refetchMcpServers, updateAssistant])

    const onGenerateAndCreate = useCallback(async () => {
        if (!customDescription.trim()) return

        dispatch(onboardingActions.setGeneratingPrompt(true))
        dispatch(onboardingActions.setError(null))

        try {
            const genResult = await generatePrompt({ prompt: customDescription }).unwrap()
            const generatedInstruction = genResult?.instruction || ''

            if (!generatedInstruction) {
                throw new Error('Empty prompt generated')
            }

            dispatch(onboardingActions.setGeneratedPrompt(generatedInstruction))
            dispatch(onboardingActions.setCreatingAssistant(true))

            const result = await createAssistant([{
                name: t('business_custom_name', 'Мой ассистент') || '',
                instruction: generatedInstruction,
                model: 'gpt-realtime-mini',
                voice: 'alloy',
                analytic: true,
                tools: []
            }]).unwrap()

            if (result?.[0]?.id) {
                const assistantId = result[0].id
                dispatch(onboardingActions.setCreatedAssistantId(assistantId))

                // Auto-attach existing Telegram MCP server
                try {
                    const { data: servers } = await refetchMcpServers()
                    const telegramServer = servers?.find(s => s.composioToolkit === 'telegram')
                    if (telegramServer) {
                        await updateAssistant({
                            id: assistantId,
                            mcpServers: [telegramServer]
                        }).unwrap()
                    }
                } catch {
                    // Non-critical: user can attach MCP server manually later
                }

                dispatch(onboardingActions.nextStep())
            }
        } catch (err: any) {
            dispatch(onboardingActions.setError(err?.data?.message || 'Error generating prompt'))
            dispatch(onboardingActions.setGeneratingPrompt(false))
            dispatch(onboardingActions.setCreatingAssistant(false))
        }
    }, [customDescription, dispatch, generatePrompt, createAssistant, t, refetchMcpServers, updateAssistant])

    const onBack = useCallback(() => {
        dispatch(onboardingActions.prevStep())
    }, [dispatch])

    return (
        <VStack gap="16" align="center" max className={className}>
            <Text
                title={t('business_title')}
                text={t('business_subtitle')}
                align="center"
                size="l"
            />

            <HStack gap="12" wrap="wrap" justify="center" max>
                {businessCards.map(card => (
                    <BusinessCard
                        key={card.id}
                        id={card.id}
                        Icon={card.Icon}
                        label={t(card.labelKey, card.id)}
                        selected={selectedTemplate === card.id}
                        onClick={onSelectCard}
                    />
                ))}
            </HStack>

            {hasFeatures && (
                <VStack gap="8" className={cls.featuresBlock}>
                    <Text
                        text={t('business_features_title')}
                        size="xs"
                        bold
                    />

                    {/* All features — template defaults + user-added, all deletable */}
                    {customFeatures.map((feature, i) => (
                        <HStack key={i} gap="8" align="center">
                            <Check size={14} className={cls.checkIcon} />
                            <Text text={feature} size="s" />
                            <Button
                                variant="clear"
                                size="s"
                                onClick={() => { onRemoveFeature(i) }}
                                addonLeft={<X size={12} />}
                            >
                                {null}
                            </Button>
                        </HStack>
                    ))}

                    {/* Add new feature */}
                    <HStack gap="8" max align="center">
                        <Input
                            value={newFeature}
                            onChange={(e) => { setNewFeature(e.target.value) }}
                            onKeyDown={onFeatureKeyDown}
                            placeholder={t('business_features_add_placeholder') || ''}
                            disabled={isLoading}
                            size="small"
                        />
                        <Button
                            variant="clear"
                            size="s"
                            onClick={onAddFeature}
                            disabled={!newFeature.trim() || isLoading}
                            addonLeft={<Plus size={14} />}
                        >
                            {t('business_features_add_btn')}
                        </Button>
                    </HStack>
                </VStack>
            )}

            {isCustom && (
                <VStack gap="8" max className={cls.customBlock}>
                    <Text
                        text={t('business_custom_label')}
                        bold
                        size="s"
                    />
                    <Textarea
                        multiline
                        rows={3}
                        value={customDescription}
                        onChange={onCustomDescriptionChange}
                        placeholder={t('business_custom_placeholder') || ''}
                        disabled={isLoading}
                    />
                    <HStack gap="4" align="center">
                        <Sparkles size={14} className={cls.hintIcon} />
                        <Text
                            text={t('business_custom_hint')}
                            size="xs"
                        />
                    </HStack>
                </VStack>
            )}

            {isLoading && (
                <HStack gap="12" className={cls.loadingBlock}>
                    <Loader2 size={18} className={cls.loadingSpinnerIcon} />
                    <Text
                        text={isGenerating
                            ? t('business_generating')
                            : t('business_creating')
                        }
                        size="s"
                        variant="accent"
                    />
                </HStack>
            )}

            {error && (
                <Text text={error} variant="error" size="s" />
            )}

            <HStack gap="16" justify="center" max>
                <Button
                    variant="clear"
                    size="m"
                    onClick={onBack}
                    disabled={isLoading}
                    addonLeft={<ArrowLeft size={14} />}
                >
                    {t('back')}
                </Button>

                {isCustom
                    ? (
                        <Button
                            variant="glass-action"
                            size="l"
                            onClick={onGenerateAndCreate}
                            disabled={!customDescription.trim() || isLoading}
                            addonLeft={<Sparkles size={16} />}
                        >
                            {t('business_generate')}
                        </Button>
                    )
                    : (
                        <Button
                            variant="glass-action"
                            size="l"
                            onClick={onCreateFromTemplate}
                            disabled={!selectedTemplate || isLoading}
                            addonLeft={<Sparkles size={16} />}
                        >
                            {t('business_create')}
                        </Button>
                    )}
            </HStack>
        </VStack>
    )
})
