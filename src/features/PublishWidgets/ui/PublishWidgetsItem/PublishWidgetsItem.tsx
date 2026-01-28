import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsItem.module.scss'
import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CodeIcon from '@mui/icons-material/Code'
import { useNavigate } from 'react-router-dom'
import { getRoutePublishWidgetsEdit } from '@/shared/const/router'
import { WidgetKey } from '@/entities/WidgetKeys'

interface PublishWidgetsItemProps {
    className?: string
    widget: WidgetKey
    onDelete?: (id: string) => void
    onShowCode?: (widget: WidgetKey) => void
}

export const PublishWidgetsItem = memo((props: PublishWidgetsItemProps) => {
    const { className, widget, onDelete, onShowCode } = props
    const { t } = useTranslation('publish-widgets')
    const navigate = useNavigate()

    const onEdit = useCallback(() => {
        navigate(getRoutePublishWidgetsEdit(String(widget.id)))
    }, [widget.id, navigate])

    const handleDelete = useCallback(() => {
        if (onDelete) onDelete(String(widget.id))
    }, [widget.id, onDelete])

    return (
        <Card padding={'16'} max className={classNames(cls.PublishWidgetsItem, {}, [className])}>
            <HStack justify={'between'} max>
                <VStack gap={'4'}>
                    <Text text={widget.name} bold />
                    <Text text={`${t('Ассистент')}: ${widget.assistant?.name || '-'}`} />
                    <Text text={`${t('Домены')}: ${widget.allowedDomains}`} />
                </VStack>
                <HStack gap={'8'}>
                    <Button variant={'clear'} onClick={() => onShowCode?.(widget)}>
                        <CodeIcon fontSize={'small'} />
                    </Button>
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
