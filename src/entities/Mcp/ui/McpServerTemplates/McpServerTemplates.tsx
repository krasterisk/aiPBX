import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { classNames } from '@/shared/lib/classNames/classNames'
import { mcpServerTemplates } from '../../model/const/mcpServerTemplates'
import { useComposioConnect } from '../../api/mcpApi'
import cls from './McpServerTemplates.module.scss'

interface McpServerTemplatesProps {
    className?: string
}

export const McpServerTemplates = memo((props: McpServerTemplatesProps) => {
    const { className } = props
    const { t } = useTranslation('tools')
    const [composioConnect, { isLoading }] = useComposioConnect()

    const onTemplateClick = useCallback(async (toolkit: string) => {
        try {
            const result = await composioConnect({ toolkit }).unwrap()
            if (result.redirectUrl) {
                window.open(result.redirectUrl, 'composio_auth', 'width=600,height=700')
            }
        } catch (e) {
            toast.error(t('Ошибка подключения сервиса'))
        }
    }, [composioConnect, t])

    return (
        <VStack gap="16" max className={classNames(cls.templateSection, {}, [className])}>
            <VStack gap="4">
                <Text title={t('Подключите сервисы')} bold />
                <Text text={t('Выберите сервис для быстрого подключения через OAuth')} />
            </VStack>

            <div className={cls.templateGrid}>
                {mcpServerTemplates.map((template) => (
                    <VStack
                        key={template.id}
                        gap="8"
                        align="center"
                        justify="center"
                        className={classNames(cls.templateCard, { [cls.loading]: isLoading })}
                        onClick={() => onTemplateClick(template.toolkit)}
                    >
                        <HStack
                            justify="center"
                            align="center"
                            className={classNames(cls.iconWrapper, {}, [cls[template.colorClass]])}
                        >
                            <template.Icon size={24} />
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
                        <Text
                            text={t('Подключить')}
                            className={cls.connectLabel}
                            size="xs"
                            variant="accent"
                        />
                    </VStack>
                ))}
            </div>
        </VStack>
    )
})
