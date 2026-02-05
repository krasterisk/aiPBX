import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './PublishWidgetsItem.module.scss'
import { memo, useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/ui/redesigned/Card'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { getRoutePublishWidgetsEdit } from '@/shared/const/router'
import { WidgetKey, WidgetAppearanceSettings, DEFAULT_APPEARANCE_SETTINGS } from '@/entities/WidgetKeys'
import { Button } from '@/shared/ui/redesigned/Button'
import CodeIcon from '@mui/icons-material/Code'
import { GetCodeDialog } from '../GetCodeDialog/GetCodeDialog'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@/shared/ui/redesigned/Icon'
import { Globe, Bot, Zap } from 'lucide-react'

interface PublishWidgetsItemProps {
    className?: string
    widget: WidgetKey
}

export const PublishWidgetsItem = memo((props: PublishWidgetsItemProps) => {
    const { className, widget } = props
    const { t } = useTranslation('publish-widgets')
    const navigate = useNavigate()

    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false)

    const appearance: WidgetAppearanceSettings = useMemo(() => {
        try {
            return widget.appearance ? JSON.parse(widget.appearance) : DEFAULT_APPEARANCE_SETTINGS
        } catch (e) {
            return DEFAULT_APPEARANCE_SETTINGS
        }
    }, [widget.appearance])

    const logoUrl = useMemo(() => {
        const logo = widget.logo || appearance.logo
        if (!logo) return ''
        return logo.startsWith('http') ? logo : `${__STATIC__}/${logo}`
    }, [widget.logo, appearance.logo])

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

    return (
        <Card
            padding={'0'}
            max
            border={'partial'}
            variant={'outlined'}
            className={classNames(cls.PublishWidgetsItem, {}, [className])}
            onClick={onOpenEdit}
        >
            <VStack className={cls.content} max>
                <HStack gap={'16'} justify={'between'} max align="start">
                    <HStack gap={'16'} max>
                        <div className={cls.logoWrapper}>
                            {logoUrl ? (
                                <img src={logoUrl} alt={widget.name} className={cls.logo} />
                            ) : (
                                <div className={cls.defaultIcon} style={{ background: appearance.buttonColor }}>
                                    <Bot size={24} color="white" />
                                </div>
                            )}
                            <div className={cls.colorIndicator} style={{ borderColor: appearance.buttonColor }} />
                        </div>
                        <VStack max gap="4">
                            <Text title={widget.name} size={'m'} bold className={cls.title} />
                            <HStack gap="8" align="center">
                                <Icon Svg={Bot} width={14} height={14} className={cls.metaIcon} />
                                <Text text={widget.assistant?.name || t('Без ассистента')} variant={'accent'} />
                            </HStack>
                        </VStack>
                    </HStack>
                    <div className={classNames(cls.statusBadge, { [cls.active]: widget.isActive })}>
                        <div className={cls.statusDot} />
                        <Text text={widget.isActive ? t('Активен') : t('Неактивен')} />
                    </div>
                </HStack>

                <div className={cls.divider} />

                <VStack gap="12" max className={cls.details}>
                    <HStack gap="12" align="center">
                        <div className={cls.detailIcon}>
                            <Globe size={14} />
                        </div>
                        <VStack>
                            <Text text={t('Разрешённые домены')} variant="accent" />
                            <Text
                                text={widget.allowedDomains ? widget.allowedDomains.split(',').join(', ') : t('Все домены')}
                                className={cls.truncatedText}
                            />
                        </VStack>
                    </HStack>

                    <HStack gap="12" align="center">
                        <div className={cls.detailIcon}>
                            <Zap size={14} />
                        </div>
                        <VStack>
                            <Text text={t('Лимиты')} variant="accent" />
                            <Text
                                text={`${widget.maxConcurrentSessions} сессий • ${widget.maxSessionDuration} сек`}
                            />
                        </VStack>
                    </HStack>
                </VStack>

                <HStack className={cls.footer} justify={'between'} max align="center">
                    <div className={cls.appearancePreview}>
                        <div className={cls.previewDot} style={{ background: appearance.buttonColor }} title={String(t('Цвет кнопки'))} />
                        <div className={cls.previewDot} style={{ background: appearance.primaryColor }} title={String(t('Основной цвет'))} />
                        <Text text={appearance.theme} size="xs" className={cls.themeTag} />
                    </div>

                    <Button
                        variant={'clear'}
                        onClick={onShowCode}
                        addonLeft={<Icon Svg={CodeIcon} />}
                        className={cls.getCodeBtn}
                        size={'s'}
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
