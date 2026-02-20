import { memo } from 'react'
import { AiModel } from '../../model/types/aiModel'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { VStack } from '@/shared/ui/redesigned/Stack'
import cls from './AiModelItem.module.scss'
import { useTranslation } from 'react-i18next'
import { classNames } from '@/shared/lib/classNames/classNames'

interface AiModelItemProps {
    className?: string
    model: AiModel
    onEdit: (model: AiModel) => void
    onDelete: (id: number) => void
}

export const AiModelItem = memo((props: AiModelItemProps) => {
    const {
        className,
        model,
        onEdit,
        onDelete
    } = props

    const { t } = useTranslation('admin')

    return (
        <Card
            className={classNames(cls.AiModelItem, {}, [className])}
            padding="24"
            max
        >
            <VStack gap="16" max>
                <div className={cls.header}>
                    <VStack gap="4">
                        <Text title={model.name} size="l" bold />
                        <Text text={model.comment} size="s" variant="accent" />
                    </VStack>
                </div>

                <div className={cls.actions}>
                    <Button onClick={() => { onEdit(model) }} variant="outline" size="m">
                        {t('Edit')}
                    </Button>
                    <Button onClick={() => { onDelete(model.id) }} variant="outline" color="error" size="m">
                        {t('Delete')}
                    </Button>
                </div>
            </VStack>
        </Card>
    )
})
