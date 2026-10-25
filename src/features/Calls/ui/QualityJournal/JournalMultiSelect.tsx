import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Check, Search } from 'lucide-react'
import { ClickAwayListener, Popper } from '@mui/material'
import type { JournalPersonOption } from '@/entities/Report'
import cls from './CallsJournal.module.scss'

export function JournalMultiSelect({ label, options, value, onChange, disabled = false }: {
    label: string
    options: JournalPersonOption[]
    value: string[]
    onChange: (values: string[]) => void
    disabled?: boolean
}) {
    const { t } = useTranslation('quality-journal')
    const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null)
    const [search, setSearch] = useState('')
    const id = useId()
    const selected = options.filter(o => value.includes(o.value))
    const unknown = value.filter(v => !options.some(o => o.value === v)).map(v => ({ value: v, label: t('selectedValue') }))
    const visible = [...unknown, ...options].filter(o => o.label.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    const close = () => { anchor?.focus(); setAnchor(null); setSearch('') }
    return (
        <ClickAwayListener onClickAway={() => { if (anchor) close() }}>
            <div className={cls.multi} onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); close() } }}>
                <button type="button" className={cls.control} disabled={disabled} aria-label={label} aria-expanded={Boolean(anchor)}
                    aria-controls={anchor ? id : undefined} onClick={e => { if (anchor) close(); else setAnchor(e.currentTarget) }}>
                    <span>{label}</span><strong>{value.length === 1 && selected.length ? selected[0].label : value.length ? t('selectedCount', { count: value.length }) : t('all')}</strong>
                    <ChevronDown size={14} aria-hidden />
                </button>
                <Popper disablePortal open={Boolean(anchor)} anchorEl={anchor} placement="bottom-start" className={cls.popper}>
                    <div className={cls.menu} id={id} role="group" aria-label={label}>
                        <label className={cls.menuSearch}><Search size={14} aria-hidden /><input autoFocus value={search} placeholder={String(t('find'))} aria-label={String(t('findIn', { label }))} onChange={e => { setSearch(e.target.value) }} /></label>
                        <button type="button" className={cls.clear} onClick={() => { onChange([]) }}>{t('clearSelection')}</button>
                        <div className={cls.options}>
                            {visible.map(o => <label key={o.value} className={cls.option}>
                                <input type="checkbox" checked={value.includes(o.value)} disabled={value.length >= 100 && !value.includes(o.value)}
                                    onChange={() => { onChange(value.includes(o.value) ? value.filter(v => v !== o.value) : [...value, o.value]) }} />
                                <span>{o.label}</span>{value.includes(o.value) && <Check size={13} aria-hidden />}
                            </label>)}
                            {!visible.length && <p className={cls.note}>{t('noOptions')}</p>}
                        </div>
                    </div>
                </Popper>
            </div>
        </ClickAwayListener>
    )
}
