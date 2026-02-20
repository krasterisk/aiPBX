import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './GetCodeDialog.module.scss'
import { memo, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { Text } from '@/shared/ui/redesigned/Text'
import { Icon } from '@/shared/ui/redesigned/Icon'
import CloseIcon from '@/shared/assets/icons/close.svg'
import { WidgetKey, WidgetAppearanceSettings, DEFAULT_APPEARANCE_SETTINGS } from '@/entities/WidgetKeys'
import { generateEmbedCode } from '../../lib/generateEmbedCode'
import { EmbedCodeCard } from './components/EmbedCodeCard/EmbedCodeCard'
import { InstructionsCard } from './components/InstructionsCard/InstructionsCard'

interface GetCodeDialogProps {
    className?: string
    isOpen: boolean
    onClose: () => void
    widget: WidgetKey | null
    initialAppearance?: WidgetAppearanceSettings
}

export const GetCodeDialog = memo((props: GetCodeDialogProps) => {
    const {
        className,
        isOpen,
        onClose,
        widget,
        initialAppearance
    } = props

    const { t } = useTranslation('publish-widgets')
    const [appearance] = useState<WidgetAppearanceSettings>(
        initialAppearance || DEFAULT_APPEARANCE_SETTINGS
    )

    const embedCode = useMemo(() => {
        if (!widget) return ''
        return generateEmbedCode(widget, appearance)
    }, [widget, appearance])

    if (!widget) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            lazy
            contentClassName={cls.modalWrapper}
        >
            <VStack
                className={classNames(cls.GetCodeDialog, {}, [className])}
                max
                onClick={(e) => { e.stopPropagation() }}
            >
                <button className={cls.closeBtn} onClick={onClose}>
                    <Icon
                        Svg={CloseIcon}
                        className={cls.icon}
                    />
                </button>

                <div className={cls.content}>
                    <div className={cls.header}>
                        <VStack gap="4" max>
                            <Text
                                title={t('Установка виджета')}
                                size={'l'}
                                bold
                            />
                            <Text
                                text={t('Скопируйте код и добавьте его на ваш сайт для начала работы')}
                                variant={'accent'}
                            />
                        </VStack>
                    </div>

                    <VStack gap="24" max>
                        <EmbedCodeCard
                            embedCode={embedCode}
                            widgetName={widget.name}
                        />
                        <InstructionsCard />
                    </VStack>
                </div>
            </VStack>
        </Modal>
    )
})
