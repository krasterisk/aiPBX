import { memo } from 'react'
import { Price } from '../../model/types/price'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import cls from './PriceItem.module.scss'
import { useTranslation } from 'react-i18next'
import { classNames } from '@/shared/lib/classNames/classNames'

interface PriceItemProps {
    className?: string
    price: Price
    onEdit: (price: Price) => void
    onDelete: (id: number) => void
}

export const PriceItem = memo((props: PriceItemProps) => {
    const {
        className,
        price,
        onEdit,
        onDelete
    } = props

    const { t } = useTranslation('admin')

    return (
        <Card
            className={classNames(cls.PriceItem, {}, [className])}
            padding="24"
            max
        >
            <VStack gap="16" max>
                <VStack gap="8" max>
                    <HStack justify="between" max>
                        <Text text={t('User ID')} variant="accent" size="s" />
                        <Text text={String(price.userId)} bold />
                    </HStack>
                    <HStack justify="between" max>
                        <Text text={t('Price')} variant="accent" size="s" />
                        <Text text={String(price.realtime)} size="l" bold />
                    </HStack>
                    <HStack justify="between" max>
                        <Text text={t('Analytic Price')} variant="accent" size="s" />
                        <Text text={String(price.analytic)} size="l" bold />
                    </HStack>
                    <HStack justify="between" max>
                        <Text text={t('STT Price')} variant="accent" size="s" />
                        <Text text={String(price.stt)} size="l" bold />
                    </HStack>
                </VStack>

                <div className={cls.actions}>
                    <Button onClick={() => { onEdit(price) }} variant="outline" size="m">
                        {t('Edit')}
                    </Button>
                    <Button onClick={() => { onDelete(price.id) }} variant="outline" color="error" size="m">
                        {t('Delete')}
                    </Button>
                </div>
            </VStack>
        </Card>
    )
})
