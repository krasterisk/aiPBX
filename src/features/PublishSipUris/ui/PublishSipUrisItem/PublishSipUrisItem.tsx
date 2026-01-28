import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishSipUrisItem.module.scss'
import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { getRoutePublishSipUrisEdit } from '@/shared/const/router'
import { Assistant } from '@/entities/Assistants'

interface PublishSipUrisItemProps {
    className?: string
    assistant: Assistant
    onDelete?: (id: string) => void
}

export const PublishSipUrisItem = memo((props: PublishSipUrisItemProps) => {
    const { className, assistant, onDelete } = props
    const { t } = useTranslation('publish-sip')
    const navigate = useNavigate()

    const onCopy = useCallback(() => {
        if (assistant.sipAccount?.sipUri) {
            navigator.clipboard.writeText(assistant.sipAccount.sipUri)
            toast.success(t('Скопировано в буфер обмена'))
        }
    }, [assistant.sipAccount?.sipUri, t])

    const onEdit = useCallback(() => {
        if (assistant.id) {
            navigate(getRoutePublishSipUrisEdit(assistant.id))
        }
    }, [assistant.id, navigate])

    const handleDelete = useCallback(() => {
        if (assistant.id && onDelete) {
            onDelete(assistant.id)
        }
    }, [assistant.id, onDelete])

    if (!assistant.sipAccount) return null

    return (
        <Card padding={'16'} max className={classNames(cls.PublishSipUrisItem, {}, [className])}>
            <HStack justify={'between'} max>
                <VStack gap={'4'}>
                    <Text text={assistant.name} bold />
                    <HStack gap={'8'}>
                        <Text className={cls.sipUri} text={assistant.sipAccount.sipUri} variant={'accent'} />
                        <Button variant={'clear'} onClick={onCopy}>
                            <ContentCopyIcon fontSize={'small'} />
                        </Button>
                    </HStack>
                    <Text text={`${t('IP')}: ${assistant.sipAccount.ipAddress}`} />
                </VStack>
                <HStack gap={'8'}>
                    <Button variant={'clear'} onClick={onEdit}>
                        <EditIcon fontSize={'small'} />
                    </Button>
                    <Button variant={'clear'} color={'error'} onClick={handleDelete}>
                        <DeleteIcon fontSize={'small'} />
                    </Button>
                </HStack>
            </HStack>
        </Card>
    )
})
