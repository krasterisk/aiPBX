import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './GetCodeDialog.module.scss'
import { memo, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { CodeBlock } from '@/shared/ui/redesigned/CodeBlock'
import { WidgetKey, WidgetAppearanceSettings, DEFAULT_APPEARANCE_SETTINGS } from '@/entities/WidgetKeys'
import { generateEmbedCode } from '../../lib/generateEmbedCode'
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

    const { t } = useTranslation('assistants')
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
            <VStack className={classNames(cls.GetCodeDialog, {}, [className])} max>
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
                                    <p>1. Go to <strong>Appearance → Theme Editor</strong></p>
                                    <p>2. Select <strong>footer.php</strong> or <strong>Theme Footer</strong></p>
                                    <p>3. Paste code before <code>&lt;/body&gt;</code></p>
                                    <p>4. Click <strong>Update File</strong></p>
                                    <p style={{ marginTop: '12px', padding: '12px', background: 'var(--card-bg)', borderRadius: '6px' }}>
                                        💡 <strong>Alternative:</strong> Use a plugin like "Insert Headers and Footers" to add the code without editing theme files.
                                    </p>
                                </VStack>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className={cls.accordion}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <strong>Shopify</strong>
                            </AccordionSummary>
                            <AccordionDetails>
                                <VStack gap="8">
                                    <p>1. Go to <strong>Online Store → Themes</strong></p>
                                    <p>2. Click <strong>Actions → Edit code</strong></p>
                                    <p>3. Open <strong>Layout → theme.liquid</strong></p>
                                    <p>4. Paste code before <code>&lt;/body&gt;</code></p>
                                    <p>5. Click <strong>Save</strong></p>
                                </VStack>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion className={cls.accordion}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <strong>Wix</strong>
                            </AccordionSummary>
                            <AccordionDetails>
                                <VStack gap="8">
                                    <p>1. Go to <strong>Settings → Custom Code</strong></p>
                                    <p>2. Click <strong>+ Add Custom Code</strong></p>
                                    <p>3. Paste the code</p>
                                    <p>4. Select <strong>Body - end</strong> as placement</p>
                                    <p>5. Apply to <strong>All Pages</strong></p>
                                    <p>6. Click <strong>Apply</strong></p>
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
