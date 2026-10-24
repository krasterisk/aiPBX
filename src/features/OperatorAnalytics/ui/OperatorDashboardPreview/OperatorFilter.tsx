import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import type { AgentScorecard } from '@/entities/Report'
import { operatorIdentity } from './previewModel'
import cls from './OperatorDashboardPreview.module.scss'

export function OperatorFilter({
    options,
    value,
    onChange,
    disabled
}: {
    options: AgentScorecard[]
    value: string[]
    onChange: (ids: string[]) => void
    disabled: boolean
}) {
    const { t } = useTranslation('call-records-preview')
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const root = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const outside = (event: PointerEvent) => {
            if (!root.current?.contains(event.target as Node)) setOpen(false)
        }
        document.addEventListener('pointerdown', outside)
        return () => {
            document.removeEventListener('pointerdown', outside)
        }
    }, [])
    return (
        <div
            ref={root}
            className={cls.operatorFilter}
            onKeyDown={e => {
                if (e.key === 'Escape') {
                    setOpen(false)
                    root.current?.querySelector('button')?.focus()
                }
            }}
        >
            <button
                type="button"
                className={cls.operatorTrigger}
                aria-expanded={open}
                aria-label={String(t('operator'))}
                disabled={disabled}
                onClick={() => {
                    setOpen(!open)
                }}
            >
                <span>{t('operator')}</span>
                <strong>{value.length ? t('selectedOperators', { count: value.length }) : t('allOperators')}</strong>
                <ChevronDown size={15} aria-hidden />
            </button>
            {open && (
                <div className={cls.operatorOptions} role="group" aria-label={String(t('operator'))}>
                    <input
                        autoFocus
                        aria-label={String(t('searchOperators'))}
                        placeholder={String(t('searchOperators'))}
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value)
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            onChange([])
                        }}
                    >
                        {t('allOperators')}
                    </button>
                    <div className={cls.operatorOptionList}>
                        {options
                            .filter(o => o.operatorName.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
                            .map(o => {
                                const id = operatorIdentity(o)
                                return (
                                    <label key={id}>
                                        <input
                                            type="checkbox"
                                            checked={value.includes(id)}
                                            disabled={value.length >= 100 && !value.includes(id)}
                                            onChange={() => {
                                                onChange(value.includes(id) ? value.filter(item => item !== id) : [...value, id])
                                            }}
                                        />
                                        <span>{o.operatorName}</span>
                                    </label>
                                )
                            })}
                    </div>
                </div>
            )}
        </div>
    )
}
