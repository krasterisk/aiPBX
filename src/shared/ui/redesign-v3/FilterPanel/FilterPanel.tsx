import type { ReactNode } from 'react'
import { SidePanel } from '../SidePanel'
import { SelectControl, type SelectControlProps } from '../SelectControl'
import cls from './FilterPanel.module.scss'
export interface FilterPanelProps {
    open: boolean
     onClose: () => void
     title: string
     fields: Array<SelectControlProps & { id: string, disabledReason?: string }>
    children?: ReactNode
     onReset: () => void
     resetLabel: string
     applyLabel: string
     invalid?: boolean
    dates?: { start: string, end: string, fromLabel: string, toLabel: string, onChange: (edge: 'start' | 'end', value: string) => void, error?: string }
}
/** Presentation only: callers own filter values, authorization and supported capabilities. */
export function FilterPanel({ open, onClose, title, fields, children, onReset, resetLabel, applyLabel, invalid, dates }: FilterPanelProps) {
    return <SidePanel isOpen={open} onClose={onClose} title={title}><div className={cls.form}>
        {children}
        {dates && <><div className={cls.dates}><label>{dates.fromLabel}<input type="date" value={dates.start} onChange={e => { dates.onChange('start', e.target.value) }}/></label><label>{dates.toLabel}<input type="date" value={dates.end} onChange={e => { dates.onChange('end', e.target.value) }}/></label></div>{dates.error && <p role="alert">{dates.error}</p>}</>}
        {fields.map(({ id, disabledReason, ...props }) => <div key={id} title={disabledReason}><SelectControl {...props}/>{disabledReason && <small>{disabledReason}</small>}</div>)}
        <div className={cls.actions}><button type="button" onClick={onReset}>{resetLabel}</button><button type="button" onClick={onClose} disabled={invalid}>{applyLabel}</button></div>
    </div></SidePanel>
}
