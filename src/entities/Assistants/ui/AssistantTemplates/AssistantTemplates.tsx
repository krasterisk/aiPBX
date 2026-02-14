import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { getRouteAssistantCreate } from '@/shared/const/router'
import { assistantTemplates } from '../../model/const/assistantTemplates'
import cls from './AssistantTemplates.module.scss'

export const AssistantTemplates = memo(() => {
    const { t } = useTranslation('assistants')
    const navigate = useNavigate()

    const onTemplateClick = useCallback((templateId: string) => {
        navigate(`${getRouteAssistantCreate()}?template=${templateId}`)
    }, [navigate])

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
            </HStack>
        </VStack>
    )
})
