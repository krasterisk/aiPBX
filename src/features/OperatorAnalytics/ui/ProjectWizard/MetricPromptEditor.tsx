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
    kind?: 'metric' | 'project'
    rows?: number
    placeholder?: string
    label?: string
    helperText?: string
}

export function MetricPromptEditor({ name, value, onChange, kind = 'metric', rows = 2, placeholder, label: customLabel, helperText }: MetricPromptEditorProps) {
    const { t } = useTranslation('reports')
    const label = customLabel ?? (kind === 'project' ? name : String(t('Описание для LLM')))
    const title = kind === 'project' ? name : String(t('METRIC_PROMPT_TITLE', { name }))
    const expandLabel = String(t(kind === 'project' ? 'PROMPT_EXPAND' : 'METRIC_PROMPT_EXPAND', { name }))
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
            <div className={cls.toolbar}>
                <button
                    ref={triggerRef}
                    className={cls.expandButton}
                    type="button"
                    aria-label={expandLabel}
                    title={expandLabel}
                    onClick={() => {
                        setDraft(value)
                        setIsOpen(true)
                    }}
                >
                    <Maximize2 size={16} aria-hidden />
                </button>
            </div>
            <Textarea
                label={label}
                value={value}
                onChange={e => { onChange(e.target.value) }}
                size="small"
                fullWidth
                multiline
                rows={rows}
                placeholder={placeholder}
                helperText={helperText}
            />
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
                            {title}
                        </h2>
                        <label htmlFor={inputId}>{label}</label>
                        <textarea
                            id={inputId}
                            className={cls.input}
                            value={draft}
                            placeholder={placeholder}
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
