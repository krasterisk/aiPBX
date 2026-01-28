import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsList.module.scss'
import { memo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Loader } from '@/shared/ui/Loader'
import { PublishWidgetsItem } from '../PublishWidgetsItem/PublishWidgetsItem'
import { WidgetKey, useDeleteWidgetKey } from '@/entities/WidgetKeys'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { GetCodeDialog } from '@/features/Widgets/ui/GetCodeDialog/GetCodeDialog'

interface PublishWidgetsListProps {
    className?: string
    widgets: WidgetKey[]
    isLoading?: boolean
}

export const PublishWidgetsList = memo((props: PublishWidgetsListProps) => {
    const { className, widgets, isLoading } = props
    const { t } = useTranslation('publish-widgets')
    const [deleteWidget] = useDeleteWidgetKey()
    const [codeWidget, setCodeWidget] = useState<WidgetKey | null>(null)

    const handleDelete = useCallback(async (id: string) => {
        if (!window.confirm(t('Вы уверены, что хотите удалить виджет?') ?? '')) return
        try {
            await deleteWidget(Number(id)).unwrap()
            toast.success(t('Виджет успешно удален'))
        } catch (e) {
            toast.error(getErrorMessage(e))
        }
    }, [deleteWidget, t])

    if (isLoading) {
        return (
            <VStack max justify={'center'} align={'center'} className={className}>
                <Loader />
            </VStack>
        )
    }

    if (widgets.length === 0) {
        return (
            <VStack max justify={'center'} align={'center'} className={className}>
                <Text text={t('У вас пока нет созданных виджетов')} variant={'error'} />
            </VStack>
        )
    }

    return (
        <VStack gap={'16'} max className={classNames(cls.PublishWidgetsList, {}, [className])}>
            {widgets.map((widget) => (
                <PublishWidgetsItem
                    key={widget.id}
                    widget={widget}
                    onDelete={handleDelete}
                    onShowCode={setCodeWidget}
                />
            ))}

            {codeWidget && (
                <GetCodeDialog
                    isOpen={!!codeWidget}
                    onClose={() => setCodeWidget(null)}
                    widget={codeWidget}
                />
            )}
        </VStack>
    )
})
