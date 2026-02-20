import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './GetCodeDialog.module.scss'
import { memo, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { CodeBlock } from '@/shared/ui/redesigned/CodeBlock'
import { WidgetKey, WidgetAppearanceSettings, DEFAULT_APPEARANCE_SETTINGS } from '@/entities/WidgetKeys'
import { generateEmbedCode } from '../../../PublishWidgets/lib/generateEmbedCode'
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

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
        <Modal isOpen={isOpen} onClose={onClose} lazy>
            <VStack
                className={classNames(cls.GetCodeDialog, {}, [className])}
                max
                onClick={(e) => { e.stopPropagation() }}
            >
                <div className={cls.content}>
                    <h2 className={cls.title}>
                        {t('Код для встраивания')} "{widget.name}"
                    </h2>

                    <div className={cls.alert}>
                        {t('Скопируйте этот код и вставьте перед закрывающим тегом </body>')}
                    </div>

                    <CodeBlock
                        code={embedCode}
                        language="html"
                        showCopyButton
                    />

                    <div className={cls.section}>
                        <Accordion className={cls.accordion}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <strong>{t('Инструкции по установке')}</strong>
                            </AccordionSummary>
                            <AccordionDetails>
                                <ul className={cls.instructionsList}>
                                    <li className={cls.instructionItem}>
                                        {t('Скопируйте код выше')}
                                    </li>
                                    <li className={cls.instructionItem}>
                                        {t('Откройте HTML вашего сайта')}
                                    </li>
                                    <li className={cls.instructionItem}>
                                        {t('Вставьте перед </body>')}
                                    </li>
                                    <li className={cls.instructionItem}>
                                        {t('Сохраните и обновите!')}
                                    </li>
                                </ul>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className={cls.accordion}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <strong>WordPress</strong>
                            </AccordionSummary>
                            <AccordionDetails>
                                <VStack gap="8">
                                    <p dangerouslySetInnerHTML={{ __html: t('WordPress_Step1') }} />
                                    <p dangerouslySetInnerHTML={{ __html: t('WordPress_Step2') }} />
                                    <p dangerouslySetInnerHTML={{ __html: t('WordPress_Step3') }} />
                                    <p dangerouslySetInnerHTML={{ __html: t('WordPress_Step4') }} />
                                    <p style={{ marginTop: '12px', padding: '12px', background: 'var(--card-bg)', borderRadius: '6px' }} dangerouslySetInnerHTML={{ __html: t('WordPress_Alternative') }} />
                                </VStack>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className={cls.accordion}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <strong>Shopify</strong>
                            </AccordionSummary>
                            <AccordionDetails>
                                <VStack gap="8">
                                    <p dangerouslySetInnerHTML={{ __html: t('Shopify_Step1') }} />
                                    <p dangerouslySetInnerHTML={{ __html: t('Shopify_Step2') }} />
                                    <p dangerouslySetInnerHTML={{ __html: t('Shopify_Step3') }} />
                                    <p dangerouslySetInnerHTML={{ __html: t('Shopify_Step4') }} />
                                    <p dangerouslySetInnerHTML={{ __html: t('Shopify_Step5') }} />
                                </VStack>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className={cls.accordion}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <strong>Wix</strong>
                            </AccordionSummary>
                            <AccordionDetails>
                                <VStack gap="8">
                                    <p dangerouslySetInnerHTML={{ __html: t('Wix_Step1') }} />
                                    <p dangerouslySetInnerHTML={{ __html: t('Wix_Step2') }} />
                                    <p dangerouslySetInnerHTML={{ __html: t('Wix_Step3') }} />
                                    <p dangerouslySetInnerHTML={{ __html: t('Wix_Step4') }} />
                                    <p dangerouslySetInnerHTML={{ __html: t('Wix_Step5') }} />
                                    <p dangerouslySetInnerHTML={{ __html: t('Wix_Step6') }} />
                                </VStack>
                            </AccordionDetails>
                        </Accordion>
                    </div>

                    <div className={cls.actions}>
                        <Button onClick={onClose}>
                            {t('Закрыть')}
                        </Button>
                    </div>
                </div>
            </VStack>
        </Modal>
    )
})
