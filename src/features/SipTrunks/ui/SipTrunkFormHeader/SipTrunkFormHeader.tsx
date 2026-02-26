import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './SipTrunkFormHeader.module.scss'

interface SipTrunkFormHeaderProps {
    className?: string
    onSave?: () => void
    onClose?: () => void
    isEdit?: boolean
    isLoading?: boolean
    variant?: 'diviner-top' | 'diviner-bottom'
    onDelete?: () => void
    trunkName?: string
}

export const SipTrunkFormHeader = memo((props: SipTrunkFormHeaderProps) => {
    const {
        className,
        onSave,
        onClose,
        isEdit,
        isLoading,
        variant = 'diviner-top',
        trunkName,
        onDelete
    } = props
    const { t } = useTranslation('sip-trunks')

    return (
        <HStack
            max
            justify="between"
            className={classNames(
                cls.SipTrunkFormHeader,
                { [cls.bottom]: variant === 'diviner-bottom' },
                [className]
            )}
        >
            <VStack gap="4">
                {variant !== 'diviner-bottom' && (
                    <Text
                        title={isEdit ? (trunkName || t('Редактирование SIP Trunk')) : t('Новый SIP Trunk')}
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
