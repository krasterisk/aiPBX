import { memo } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PricesListHeader.module.scss'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { useTranslation } from 'react-i18next'

interface PricesListHeaderProps {
    className?: string
    onCreate: () => void
}

export const PricesListHeader = memo((props: PricesListHeaderProps) => {
    const {
        className,
        onCreate
    } = props

    const { t } = useTranslation('admin')

    return (
        <HStack max justify="between" className={classNames(cls.PricesListHeader, {}, [className])}>
            <Text title={t('Prices Management')} size="l" bold />
            <Button onClick={onCreate} variant="outline" className={cls.createBtn}>
                {t('Add Price')}
            </Button>
        </HStack>
    )
})
