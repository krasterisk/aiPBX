import { useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Maximize2 } from 'lucide-react'
import { Button } from '@/shared/ui/redesign-v3/Button'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { Textarea } from '@/shared/ui/mui/Textarea'
import cls from './MetricPromptEditor.module.scss'

interface MetricPromptEditorProps {
    name: string
    value: string
    onChange: (value: string) => void
}

export function MetricPromptEditor({ name, value, onChange }: MetricPromptEditorProps) {
    const { t } = useTranslation('reports')
    const [isOpen, setIsOpen] = useState(false)
    const [draft, setDraft] = useState('')
    const titleId = useId()
    const inputId = useId()
    const triggerRef = useRef<HTMLButtonElement>(null)
    const dialogRef = useRef<HTMLDivElement>(null)

    const close = () => {
        setIsOpen(false)
        triggerRef.current?.focus()
    }

    return (
        <div className={cls.root}>
            <Textarea
                label={String(t('Описание для LLM'))}
                value={value}
                onChange={e => { onChange(e.target.value) }}
                size="small"
                fullWidth
                multiline
                rows={2}
            />
            <Button
                ref={triggerRef}
                variant="clear"
                type="button"
                aria-label={String(t('METRIC_PROMPT_EXPAND', { name }))}
                addonLeft={<Maximize2 size={16} aria-hidden />}
                onClick={() => {
                    setDraft(value)
                    setIsOpen(true)
                }}
            >
                {String(t('Развернуть'))}
            </Button>
            {isOpen && (
                <Modal isOpen onClose={close} size="wide" elevated>
                    <div
                        ref={dialogRef}
                        className={cls.editor}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        onKeyDown={event => {
                            if (event.key === 'Escape') {
                                event.stopPropagation()
                                close()
                            } else if (event.key === 'Tab') {
                                const controls = dialogRef.current?.querySelectorAll<HTMLElement>('textarea, button')
                                if (!controls?.length) return
                                const first = controls[0]
                                const last = controls[controls.length - 1]
                                if (event.shiftKey && document.activeElement === first) {
                                    event.preventDefault()
                                    last.focus()
                                } else if (!event.shiftKey && document.activeElement === last) {
                                    event.preventDefault()
                                    first.focus()
                                }
                            }
                        }}
                    >
                        <h2 id={titleId} className={cls.title}>
                            {String(t('METRIC_PROMPT_TITLE', { name }))}
                        </h2>
                        <label htmlFor={inputId}>{String(t('Описание для LLM'))}</label>
                        <textarea
                            id={inputId}
                            className={cls.input}
                            value={draft}
                            onChange={event => { setDraft(event.target.value) }}
                            autoFocus
                        />
                        <p className={cls.hint}>{String(t('METRIC_PROMPT_SAVE_HINT'))}</p>
                        <div className={cls.actions}>
                            <Button variant="clear" type="button" onClick={close}>
                                {String(t('Отмена'))}
                            </Button>
                            <Button variant="primary" type="button" onClick={() => {
                                onChange(draft)
                                close()
                            }}>
                                {String(t('Применить'))}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}
