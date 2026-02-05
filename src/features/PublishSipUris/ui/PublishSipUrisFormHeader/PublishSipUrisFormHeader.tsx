import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisFormHeader.module.scss'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { CardVariant } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'

interface PublishSipUrisFormHeaderProps {
    className?: string
    onSave?: () => void
    onClose?: () => void
    isEdit?: boolean
    isLoading?: boolean
    variant?: CardVariant | 'diviner-top' | 'diviner-bottom'
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
        variant,
        assistantName,
        onDelete
    } = props
    const { t } = useTranslation('publish-sip')

    return (
        <HStack
            max
            justify={variant === 'diviner-bottom' ? 'end' : 'between'}
            align="center"
            className={classNames(
                cls.PublishSipUrisFormHeader,
                { [cls.bottom]: variant === 'diviner-bottom' },
                [className]
            )}
        >
            {variant !== 'diviner-bottom' && (
                <VStack gap="4">
                    <Text
                        title={isEdit ? (assistantName || t('Редактирование SIP URI')) : t('Новый SIP URI')}
                        size="l"
                        bold
                    />
                </VStack>
            )}

            <HStack gap="16" className={cls.actions}>
                {isEdit && onDelete && (
                    <Button
                        variant="clear"
                        color="error" // Use error color if supported by Button
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
