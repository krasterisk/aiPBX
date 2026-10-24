import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CalendarDays, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { customDateRange, datePreset, shiftDateRange, localDateInput, type DatePreset, type DateRange } from './datePresets'
import cls from './PreviewDatePresets.module.scss'

export function PreviewDatePresets({
    value,
    onChange,
    onOpenFilters
}: {
    value: DateRange
    onChange: (value: DateRange) => void
    onOpenFilters?: () => void
}) {
    const { t } = useTranslation('call-records-preview')
    const [custom, setCustom] = useState(false)
    const [from, setFrom] = useState(localDateInput(value.startDate))
    const [to, setTo] = useState(localDateInput(value.endDate))
    const range = customDateRange(from, to)
    const presets: DatePreset[] = ['today', 'yesterday', 'week', 'last30', 'month']
    return (
        <div className={cls.root}>
            <div className={cls.presets} role="group" aria-label={String(t('datePresets'))}>
                <CalendarDays size={17} aria-hidden />
                {presets.map(preset => {
                    const candidate = datePreset(preset)
                    const start = new Date(value.startDate); const end = new Date(value.endDate)
                    const calendarWeek = preset === 'week' && start.getDay() === 1 && end.getDay() === 0 && Math.round((Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / 86400000) === 6
                    const calendarMonth = preset === 'month' && start.getDate() === 1 && start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth() && end.getDate() === new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate()
                    return (
                        <button
                            key={preset}
                            type="button"
                            aria-pressed={calendarWeek || calendarMonth || (candidate.startDate === value.startDate && candidate.endDate === value.endDate)}
                            onClick={() => {
                                setCustom(false)
                                onChange(candidate)
                            }}
                        >
                            {t(`preset_${preset}`)}
                        </button>
                    )
                })}
                <button
                    type="button"
                    aria-expanded={custom}
                    onClick={() => {
                        setFrom(localDateInput(value.startDate))
                        setTo(localDateInput(value.endDate))
                        setCustom(!custom)
                    }}
                >
                    {t('preset_custom')}
                </button>
                {onOpenFilters && (
                    <button type="button" onClick={onOpenFilters} aria-label={String(t('filters'))}>
                        <SlidersHorizontal size={16} aria-hidden />
                    </button>
                )}
            </div>
            <div className={cls.range}>
                <button
                    type="button"
                    aria-label={String(t('previousPeriod'))}
                    title={String(t('previousPeriod'))}
                    onClick={() => {
                        setCustom(false)
                        onChange(shiftDateRange(value, -1))
                    }}
                >
                    <ChevronLeft size={18} aria-hidden />
                </button>
                <span aria-live="polite">
                    {new Date(value.startDate).toLocaleDateString()} — {new Date(value.endDate).toLocaleDateString()}
                </span>
                <button
                    type="button"
                    aria-label={String(t('nextPeriod'))}
                    title={String(t('nextPeriod'))}
                    onClick={() => {
                        setCustom(false)
                        onChange(shiftDateRange(value, 1))
                    }}
                >
                    <ChevronRight size={18} aria-hidden />
                </button>
            </div>
            {custom && (
                <form
                    className={cls.custom}
                    onSubmit={e => {
                        e.preventDefault()
                        if (range) {
                            onChange(range)
                            setCustom(false)
                        }
                    }}
                >
                    <label>
                        {t('dateFrom')}
                        <input
                            type="date"
                            required
                            value={from}
                            max={to || undefined}
                            onChange={e => {
                                setFrom(e.target.value)
                            }}
                        />
                    </label>
                    <label>
                        {t('dateTo')}
                        <input
                            type="date"
                            required
                            value={to}
                            min={from || undefined}
                            onChange={e => {
                                setTo(e.target.value)
                            }}
                        />
                    </label>
                    <button type="submit" disabled={!range}>
                        {t('applyDates')}
                    </button>
                </form>
            )}
        </div>
    )
}
