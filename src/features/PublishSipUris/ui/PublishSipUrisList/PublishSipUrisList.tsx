import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisList.module.scss'
import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Loader } from '@/shared/ui/Loader'
import { PublishSipUrisItem } from '../PublishSipUrisItem/PublishSipUrisItem'
import { Assistant } from '@/entities/Assistants'
import { toast } from 'react-toastify'
import { getErrorMessage } from '@/shared/lib/functions/getErrorMessage'
import { useDeleteSipUri } from '@/entities/PbxServers'

interface PublishSipUrisListProps {
    className?: string
    assistants: Assistant[]
    isLoading?: boolean
}

export const PublishSipUrisList = memo((props: PublishSipUrisListProps) => {
    const { className, assistants, isLoading } = props
    const { t } = useTranslation('publish-sip')
    const [deleteSip] = useDeleteSipUri()

    const handleDelete = useCallback(async (assistantId: string) => {
        if (!window.confirm(t('Вы уверены, что хотите удалить SIP URI?') ?? '')) return
        try {
            await deleteSip({ assistantId }).unwrap()
            toast.success(t('SIP URI успешно удален'))
        } catch (e) {
            toast.error(getErrorMessage(e))
        }
    }, [deleteSip, t])

    if (isLoading) {
        return (
            <VStack max justify={'center'} align={'center'} className={classNames(cls.PublishSipUrisList, {}, [className])}>
                <Loader />
            </VStack>
        )
    }

    if (assistants.length === 0) {
        return (
            <VStack max justify={'center'} align={'center'} className={classNames(cls.PublishSipUrisList, {}, [className])}>
                <Text text={t('У вас пока нет активных SIP URIs')} variant={'error'} />
            </VStack>
        )
    }

    return (
        <VStack gap={'16'} max className={classNames(cls.PublishSipUrisList, {}, [className])}>
            {assistants.map((assistant) => (
                <PublishSipUrisItem
                    key={assistant.id}
                    assistant={assistant}
                    onDelete={handleDelete}
                />
            ))}
        </VStack>
    )
})
