import { memo } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AiModelsListHeader.module.scss'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { useTranslation } from 'react-i18next'

interface AiModelsListHeaderProps {
    className?: string
    onCreate: () => void
}

export const AiModelsListHeader = memo((props: AiModelsListHeaderProps) => {
    const {
        className,
        onCreate
    } = props

    const { t } = useTranslation('admin')

    return (
        <HStack max justify="between" className={classNames(cls.AiModelsListHeader, {}, [className])}>
            <Text title={t('Models Management')} size="l" bold />
            <Button onClick={onCreate} variant="outline" className={cls.createBtn}>
                {t('Add Model')}
            </Button>
        </HStack>
    )
})
