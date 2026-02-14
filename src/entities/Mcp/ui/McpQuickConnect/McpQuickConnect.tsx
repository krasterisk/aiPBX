import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Zap } from 'lucide-react'
import { mcpServerTemplates } from '../../model/const/mcpServerTemplates'
import { useComposioConnect } from '../../api/mcpApi'
import cls from './McpQuickConnect.module.scss'

interface McpQuickConnectProps {
    className?: string
}

export const McpQuickConnect = memo((props: McpQuickConnectProps) => {
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
        <VStack gap="8" max className={classNames(cls.quickConnect, {}, [className])}>
            <HStack gap="8" align="center">
                <Zap size={16} className={cls.zapIcon} />
                <Text text={t('Быстрое подключение')} size="s" bold />
            </HStack>

            <div className={cls.stripWrapper}>
                <HStack gap="12" className={cls.strip}>
                    {mcpServerTemplates.map((template) => (
                        <VStack
                            key={template.id}
                            gap="4"
                            align="center"
                            className={classNames(cls.quickItem, { [cls.loading]: isLoading })}
                            onClick={() => onTemplateClick(template.toolkit)}
                        >
                            <HStack
                                justify="center"
                                align="center"
                                className={classNames(cls.quickIcon, {}, [cls[template.colorClass]])}
                            >
                                <template.Icon size={18} />
                            </HStack>
                            <Text
                                text={t(template.nameKey)}
                                size="xs"
                                className={cls.quickName}
                                align="center"
                            />
                        </VStack>
                    ))}
                </HStack>
            </div>
        </VStack>
    )
})
