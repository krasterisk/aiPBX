import { useId, useState } from 'react'
import { ClickAwayListener, Popper } from '@mui/material'
import { Check, ChevronDown, Search } from 'lucide-react'
import cls from './SelectControl.module.scss'
export interface SelectOption { value: string, label: string }
export interface SelectControlProps {
    label: string
     options: SelectOption[]
     value: string[]
     onChange: (value: string[]) => void
    disabled?: boolean
     multiple?: boolean
     maxSelected?: number
    messages: { all: string, selected: (count: number) => string, search: string, clear: string, empty: string, unknown: string }
}
export function SelectControl({ label, options, value, onChange, disabled, multiple = true, maxSelected = 100, messages }: SelectControlProps) {
    const id = useId()
    const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null)
    const [search, setSearch] = useState('')
    const close = () => { anchor?.focus(); setAnchor(null); setSearch('') }
    const selected = options.filter(o => value.includes(o.value))
    const unknown = value.filter(v => !options.some(o => o.value === v)).map(v => ({ value: v, label: messages.unknown }))
    const visible = [...unknown, ...options].filter(o => o.label.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    return <ClickAwayListener onClickAway={() => { if (anchor) close() }}><div className={cls.field} onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); close() } }}>
        <button type="button" className={cls.control} aria-label={label} aria-expanded={Boolean(anchor)} aria-controls={anchor ? id : undefined} disabled={disabled} onClick={e => { if (anchor) close(); else setAnchor(e.currentTarget) }}>
            <span>{label}</span><strong>{value.length === 1 && selected.length ? selected[0].label : value.length ? messages.selected(value.length) : messages.all}</strong><ChevronDown size={14} aria-hidden />
        </button>
        <Popper disablePortal open={Boolean(anchor)} anchorEl={anchor} placement="bottom-start" className={cls.popper}><div className={cls.menu} id={id} role="group" aria-label={label}>
            <label className={cls.search}><Search size={14} aria-hidden /><input autoFocus value={search} aria-label={messages.search} placeholder={messages.search} onChange={e => { setSearch(e.target.value) }} /></label>
            <button type="button" className={cls.clear} onClick={() => { onChange([]); if (!multiple) close() }}>{messages.clear}</button>
            <div className={cls.options}>{visible.map(o => <label className={cls.option} key={o.value}><input type={multiple ? 'checkbox' : 'radio'} name={id} checked={value.includes(o.value)} disabled={multiple && value.length >= maxSelected && !value.includes(o.value)} onChange={() => {
                onChange(multiple ? value.includes(o.value) ? value.filter(v => v !== o.value) : [...value, o.value] : [o.value]); if (!multiple) close()
            }} /><span>{o.label}</span>{value.includes(o.value) && <Check size={13} aria-hidden />}</label>)}{!visible.length && <p>{messages.empty}</p>}</div>
        </div></Popper>
    </div></ClickAwayListener>
}
