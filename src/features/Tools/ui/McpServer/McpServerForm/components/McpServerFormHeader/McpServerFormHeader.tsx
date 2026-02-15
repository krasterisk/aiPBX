import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './McpServerFormHeader.module.scss'

interface McpServerFormHeaderProps {
    className?: string
    isEdit?: boolean
    serverName?: string
    onSave?: () => void
    onClose?: () => void
    onDelete?: () => void
    isLoading?: boolean
    variant?: 'diviner-top' | 'diviner-bottom'
    hideActions?: boolean
}

export const McpServerFormHeader = memo((props: McpServerFormHeaderProps) => {
    const {
        className,
        isEdit,
        serverName,
        onSave,
        onClose,
        onDelete,
        isLoading,
        variant = 'diviner-top',
        hideActions
    } = props

    const { t } = useTranslation('tools')

    return (
        <HStack
            max
            justify={variant === 'diviner-bottom' ? 'end' : 'between'}
            className={classNames(cls.McpServerFormHeader, { [cls.bottom]: variant === 'diviner-bottom' }, [className])}
        >
            {variant === 'diviner-top' && (
                <VStack gap="4">
                    <Text
                        title={isEdit ? (serverName || t('Редактирование')) : t('Новый MCP сервер')}
                        size="l"
                        bold
                    />
                </VStack>
            )}

            <HStack gap="8" className={cls.actions}>
                {isEdit && onDelete && (
                    <Button
                        variant="glass-action"
                        color="error"
                        onClick={onDelete}
                        disabled={isLoading}
                    >
                        {t('Удалить')}
                    </Button>
                )}

                <Button
                    variant="glass-action"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    {t('Закрыть')}
                </Button>
                {!hideActions && (
                    <Button
                        variant="glass-action"
                        onClick={onSave}
                        disabled={isLoading}
                    >
                        {isEdit ? t('Сохранить') : t('Создать')}
                    </Button>
                )}
            </HStack>
        </HStack>
    )
})
