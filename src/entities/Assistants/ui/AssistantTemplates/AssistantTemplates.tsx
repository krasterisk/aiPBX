import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { getRouteAssistantCreate } from '@/shared/const/router'
import { assistantTemplates } from '../../model/const/assistantTemplates'
import { useGeneratePrompt } from '../../api/assistantsApi'
import { Sparkles, Loader2, PenLine } from 'lucide-react'
import cls from './AssistantTemplates.module.scss'

export const AssistantTemplates = memo(() => {
    const { t } = useTranslation('assistants')
    const navigate = useNavigate()
    const [generatePrompt] = useGeneratePrompt()

    const [isCustomMode, setIsCustomMode] = useState(false)
    const [customDescription, setCustomDescription] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onTemplateClick = useCallback((templateId: string) => {
        navigate(`${getRouteAssistantCreate()}?template=${templateId}`)
    }, [navigate])

    const onCustomClick = useCallback(() => {
        setIsCustomMode(true)
        setError(null)
    }, [])

    const onBackToTemplates = useCallback(() => {
        setIsCustomMode(false)
        setCustomDescription('')
        setError(null)
    }, [])

    const onGenerate = useCallback(async () => {
        if (!customDescription.trim()) return

        setIsGenerating(true)
        setError(null)

        try {
            const result = await generatePrompt({ prompt: customDescription }).unwrap()
            const instruction = result?.instruction || ''

            if (!instruction) {
                throw new Error('Empty prompt generated')
            }

            sessionStorage.setItem('generated_instruction', instruction)
            navigate(`${getRouteAssistantCreate()}?generated=true`)
        } catch (err: any) {
            setError(err?.data?.message || t('Ошибка генерации промпта'))
            setIsGenerating(false)
        }
    }, [customDescription, generatePrompt, navigate, t])

    if (isCustomMode) {
        return (
            <VStack gap="16" max className={cls.templateSection}>
                <VStack gap="4">
                    <Text title={t('Опишите ваш бизнес')} bold />
                    <Text text={t('Опишите вашу сферу деятельности, и мы сгенерируем промпт')} />
                </VStack>

                <Textarea
                    multiline
                    rows={4}
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder={t('Например: салон красоты с услугами стрижки, маникюра и макияжа') ?? ''}
                    disabled={isGenerating}
                />

                <HStack gap="4" align="center" className={cls.customHint}>
                    <Sparkles size={14} className={cls.hintIcon} />
                    <Text
                        text={t('ИИ создаст оптимальный промпт на основе вашего описания')}
                        size="s"
                    />
                </HStack>

                {isGenerating && (
                    <HStack gap="12" align="center" className={cls.loadingBlock}>
                        <Loader2 size={18} className={cls.spinnerIcon} />
                        <Text
                            text={t('Генерация...')}
                            size="s"
                            variant="accent"
                        />
                    </HStack>
                )}

                {error && (
                    <Text text={error} variant="error" size="s" />
                )}

                <HStack gap="16" justify="between" max>
                    <Button
                        variant="clear"
                        onClick={onBackToTemplates}
                        disabled={isGenerating}
                    >
                        {t('Назад к шаблонам')}
                    </Button>

                    <Button
                        variant="glass-action"
                        onClick={onGenerate}
                        disabled={!customDescription.trim() || isGenerating}
                        addonLeft={<Sparkles size={16} />}
                    >
                        {t('Сгенерировать')}
                    </Button>
                </HStack>
            </VStack>
        )
    }

    return (
        <VStack gap="16" max className={cls.templateSection}>
            <VStack gap="4">
                <Text title={t('Начните с шаблона')} bold />
                <Text text={t('Выберите шаблон для быстрого старта')} />
            </VStack>

            <HStack wrap="wrap" gap="16" max className={cls.templateGrid}>
                {assistantTemplates.map((template) => (
                    <VStack
                        key={template.id}
                        gap="8"
                        align="center"
                        justify="center"
                        className={cls.templateCard}
                        onClick={() => onTemplateClick(template.id)}
                    >
                        <HStack
                            justify="center"
                            align="center"
                            className={cls.iconWrapper}
                        >
                            <template.Icon />
                        </HStack>
                        <Text
                            text={t(template.nameKey)}
                            className={cls.templateName}
                            align="center"
                        />
                        <Text
                            text={t(template.descriptionKey)}
                            className={cls.templateDesc}
                            align="center"
                            size="s"
                        />
                    </VStack>
                ))}

                {/* Custom / Другой */}
                <VStack
                    gap="8"
                    align="center"
                    justify="center"
                    className={`${cls.templateCard} ${cls.customCard}`}
                    onClick={onCustomClick}
                >
                    <HStack
                        justify="center"
                        align="center"
                        className={cls.iconWrapper}
                    >
                        <PenLine />
                    </HStack>
                    <Text
                        text={t('Другой')}
                        className={cls.templateName}
                        align="center"
                    />
                    <Text
                        text={t('Опишите свой бизнес — мы создадим промпт')}
                        className={cls.templateDesc}
                        align="center"
                        size="s"
                    />
                </VStack>
            </HStack>
        </VStack>
    )
})
