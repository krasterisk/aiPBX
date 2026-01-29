import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsItem.module.scss'
import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Check } from '@/shared/ui/mui/Check'
import { AppLink } from '@/shared/ui/redesigned/AppLink'
import { getRoutePublishWidgetsEdit } from '@/shared/const/router'
import { WidgetKey } from '@/entities/WidgetKeys'
import { Button } from '@/shared/ui/redesigned/Button'
import CodeIcon from '@mui/icons-material/Code'
import { GetCodeDialog } from '../GetCodeDialog/GetCodeDialog'

interface PublishWidgetsItemProps {
    className?: string
    widget: WidgetKey
    checkedItems?: string[]
    onChangeChecked?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const PublishWidgetsItem = memo((props: PublishWidgetsItemProps) => {
    const { className, widget, checkedItems, onChangeChecked } = props
    const { t } = useTranslation('publish-widgets')

    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)

    const onShowCode = useCallback(() => {
        setIsCodeModalOpen(true)
    }, [])

    const onCloseCodeModal = useCallback(() => {
        setIsCodeModalOpen(false)
    }, [])

    return (
        <Card
            padding={'16'}
            max
            border={'partial'}
            className={classNames(cls.PublishWidgetsItem, {}, [className])}
        >
            <Check
                key={String(widget.id)}
                className={classNames('', {
                    [cls.uncheck]: !checkedItems?.includes(String(widget.id)),
                    [cls.check]: checkedItems?.includes(String(widget.id))
                }, [])}
                value={String(widget.id)}
                size={'small'}
                checked={checkedItems?.includes(String(widget.id))}
                onChange={onChangeChecked}
            />

            <HStack gap={'24'} justify={'between'} max>
                <AppLink to={getRoutePublishWidgetsEdit(String(widget.id))} className={cls.link}>
                    <Text title={widget.name} text={widget.assistant?.name || ''} />
                </AppLink>
                <div className={classNames(cls.status, { [cls.active]: widget.isActive }, [])} />
                <Button
                    variant={'outline'}
                    onClick={onShowCode}
                    addonLeft={<CodeIcon fontSize={'small'} />}
                >
                    {t('Получить код')}
                </Button>
            </HStack>

            <GetCodeDialog
                isOpen={isCodeModalOpen}
                onClose={onCloseCodeModal}
                widget={widget}
            />
        </Card>
    )
})
