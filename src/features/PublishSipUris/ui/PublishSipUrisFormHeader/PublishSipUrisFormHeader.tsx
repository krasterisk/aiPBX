import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisFormHeader.module.scss'

interface PublishSipUrisFormHeaderProps {
    className?: string
    onSave?: () => void
    onClose?: () => void
    isEdit?: boolean
    isLoading?: boolean
    variant?: 'diviner-top' | 'diviner-bottom'
    onDelete?: () => void
    assistantName?: string
}

export const PublishSipUrisFormHeader = memo((props: PublishSipUrisFormHeaderProps) => {
    const {
        className,
        onSave,
        onClose,
        isEdit,
        isLoading,
        variant = 'diviner-top',
        assistantName,
        onDelete
    } = props
    const { t } = useTranslation('publish-sip')

    return (
        <HStack
            max
            justify="between"
            className={classNames(
                cls.PublishSipUrisFormHeader,
                { [cls.bottom]: variant === 'diviner-bottom' },
                [className]
            )}
        >
            <VStack gap="4">
                {variant !== 'diviner-bottom' && (
                    <Text
                        title={isEdit ? (assistantName || t('Редактирование SIP URI')) : t('Новый SIP URI')}
                        size="l"
                        bold
                    />
                )}
            </VStack>

            <HStack gap="16" className={cls.actions}>
                {isEdit && onDelete && (
                    <Button
                        variant="clear"
                        color="error"
                        onClick={onDelete}
                        disabled={isLoading}
                    >
                        {t('Удалить')}
                    </Button>
                )}
                <Button
                    variant="clear"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    {t('Закрыть')}
                </Button>
                <Button
                    variant="outline"
                    onClick={onSave}
                    disabled={isLoading}
                >
                    {isEdit ? t('Сохранить') : t('Создать')}
                </Button>
            </HStack>
        </HStack>
    )
})
