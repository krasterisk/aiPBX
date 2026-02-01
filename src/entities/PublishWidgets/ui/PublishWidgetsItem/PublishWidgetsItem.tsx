import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsItem.module.scss'
import { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Check } from '@/shared/ui/mui/Check'
import { getRoutePublishWidgetsEdit } from '@/shared/const/router'
import { WidgetKey } from '@/entities/WidgetKeys'
import { Button } from '@/shared/ui/redesigned/Button'
import CodeIcon from '@mui/icons-material/Code'
import { GetCodeDialog } from '../GetCodeDialog/GetCodeDialog'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/shared/ui/redesigned/Icon'

interface PublishWidgetsItemProps {
    className?: string
    widget: WidgetKey
    checkedItems?: string[]
    onChangeChecked?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const PublishWidgetsItem = memo((props: PublishWidgetsItemProps) => {
    const { className, widget, checkedItems, onChangeChecked } = props
    const { t } = useTranslation('publish-widgets')
    const navigate = useNavigate()

    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)

    const onShowCode = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setIsCodeModalOpen(true)
    }, [])

    const onCloseCodeModal = useCallback(() => {
        setIsCodeModalOpen(false)
    }, [])

    const onOpenEdit = useCallback(() => {
        navigate(getRoutePublishWidgetsEdit(String(widget.id)))
    }, [navigate, widget.id])

    const onCheckClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
    }, [])

    return (
        <Card
            padding={'0'}
            max
            border={'partial'}
            variant={'outlined'}
            className={classNames(cls.PublishWidgetsItem, {}, [className])}
            onClick={onOpenEdit}
        >
            <div onClick={onCheckClick}>
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
            </div>

            <VStack className={cls.content} max>
                <HStack gap={'16'} justify={'between'} max>
                    <HStack gap={'16'} max>
                        <div className={cls.itemIcon}>
                            <CodeIcon />
                        </div>
                        <VStack max>
                            <Text title={widget.name} size={'m'} bold />
                            <Text text={widget.assistant?.name || t('Без ассистента')} size={'s'} variant={'accent'} />
                        </VStack>
                    </HStack>
                    <div className={cls.statusWrapper}>
                        <div className={classNames(cls.statusDot, { [cls.active]: widget.isActive }, [])} />
                        <Text text={widget.isActive ? t('Активен') : t('Неактивен')} size={'s'} />
                    </div>
                </HStack>

                <HStack className={cls.footer} justify={'between'} max>
                    <HStack gap={'8'}>
                        {widget.allowedDomains && (
                            <Text
                                text={t('Домены') + ': ' + widget.allowedDomains.split(',').length}
                                size={'s'}
                                variant={'accent'}
                            />
                        )}
                    </HStack>
                    <Button
                        variant={'outline'}
                        onClick={onShowCode}
                        addonLeft={<Icon Svg={CodeIcon} />}
                        className={cls.getCodeBtn}
                        size={'m'}
                    >
                        {t('Получить код')}
                    </Button>
                </HStack>
            </VStack>

            <GetCodeDialog
                isOpen={isCodeModalOpen}
                onClose={onCloseCodeModal}
                widget={widget}
            />
        </Card>
    )
})
