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
import { Check } from '@/shared/ui/mui/Check'
import { AppLink } from '@/shared/ui/redesigned/AppLink'

interface PublishSipUrisItemProps {
    className?: string
    assistant: Assistant
    onDelete?: (id: string) => void
    checkedItems?: string[]
    onChangeChecked?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const PublishSipUrisItem = memo((props: PublishSipUrisItemProps) => {
    const { className, assistant, onDelete, checkedItems, onChangeChecked } = props
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
        <Card
            padding={'16'}
            max
            border={'partial'}
            className={classNames(cls.PublishSipUrisItem, {}, [className])}
        >
            <Check
                key={String(assistant.id)}
                className={classNames('', {
                    [cls.uncheck]: !checkedItems?.includes(String(assistant.id)),
                    [cls.check]: checkedItems?.includes(String(assistant.id))
                }, [])}
                value={String(assistant.id)}
                size={'small'}
                checked={checkedItems?.includes(String(assistant.id))}
                onChange={onChangeChecked}
            />

            <HStack gap={'24'} justify={'between'} max>
                <AppLink to={getRoutePublishSipUrisEdit(assistant.id!)} className={cls.link}>
                    <VStack gap={'4'}>
                        <Text title={assistant.name} className={cls.sipUri} />
                        <HStack gap={'4'}>
                            <Text
                                text={assistant.sipAccount.sipUri}
                                className={cls.sipUri}
                                variant='accent'
                            />
                            <Button
                                variant={'clear'}
                                onClick={onCopy}
                                title={t('Скопировать SIP URI') || ''}
                            >
                                <ContentCopyIcon fontSize={'small'} />
                            </Button>
                        </HStack>
                        <Text text={`${t('IP')}: ${assistant.sipAccount.ipAddress}`} />
                    </VStack>
                </AppLink>

                <HStack gap={'8'}>
                    <Button variant={'clear'} onClick={onEdit} title={t('Редактировать') || ''}>
                        <EditIcon fontSize={'small'} />
                    </Button>
                    <Button variant={'clear'} color={'error'} onClick={handleDelete} title={t('Удалить') || ''}>
                        <DeleteIcon fontSize={'small'} />
                    </Button>
                </HStack>
            </HStack>
        </Card>
    )
})
