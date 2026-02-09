import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { ToolTypeSelect, Tool, ToolType } from '@/entities/Tools'
import { ClientSelect } from '@/entities/User'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './GeneralToolCard.module.scss'

interface GeneralToolCardProps {
    className?: string
    formFields?: Partial<Tool>
    isAdmin?: boolean
    onChangeField: (field: keyof Tool, value: any) => void
    onChangeClient: (clientId: string) => void
    onChangeType: (type: string) => void
}

export const GeneralToolCard = memo((props: GeneralToolCardProps) => {
    const {
        className,
        formFields,
        isAdmin,
        onChangeField,
        onChangeClient,
        onChangeType,
    } = props
    const { t } = useTranslation('tools')

    return (
        <Card
            max
            padding="24"
            border="partial"
            className={classNames(cls.GeneralToolCard, {}, [className])}
        >
            <VStack gap="24" max align="start">
                {/* 1. Client Select for Admin */}
                {isAdmin && (
                    <VStack gap="8" max>
                        <Text text={t('Клиент') || ''} size="s" bold className={cls.label} />
                        <ClientSelect
                            clientId={String(formFields?.userId || '')}
                            onChangeClient={onChangeClient}
                            className={cls.fullWidth}
                        />
                    </VStack>
                )}

                {/* 2. Tool Type */}
                <VStack gap="8" max>
                    <Text text={t('Тип') || ''} size="s" bold className={cls.label} />
                    <ToolTypeSelect
                        value={formFields?.type}
                        onChangeToolType={(_, v: ToolType) => onChangeType(v.value)}
                        className={cls.fullWidth}
                    />
                </VStack>

                {/* 3. Comment */}
                <VStack gap="8" max>
                    <Text text={t('Комментарий') || ''} size="s" bold className={cls.label} />
                    <Textarea
                        placeholder={t('Добавьте комментарий...') ?? ''}
                        onChange={(e) => onChangeField('comment', e.target.value)}
                        value={formFields?.comment || ''}
                        className={cls.fullWidth}
                    />
                </VStack>
            </VStack>
        </Card>
    )
})
