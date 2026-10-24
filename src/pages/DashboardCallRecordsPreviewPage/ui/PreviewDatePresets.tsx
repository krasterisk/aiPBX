import { useTranslation } from 'react-i18next'
import { CalendarDays, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { datePreset, shiftDateRange, type DatePreset, type DateRange } from './datePresets'
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
    const presets: DatePreset[] = ['today', 'yesterday', 'week', 'month', 'year']
    const nextRange = shiftDateRange(value, 1)
    const canAdvance = Date.parse(nextRange.startDate) <= Date.parse(datePreset('today').endDate)
    return (
        <div className={cls.root}>
            <div className={cls.presets} role="group" aria-label={String(t('datePresets'))}>
                <CalendarDays size={17} aria-hidden />
                {presets.map(preset => {
                    const candidate = datePreset(preset)
                    const start = new Date(value.startDate)
                    const end = new Date(value.endDate)
                    const calendarWeek =
                        preset === 'week' &&
                        start.getDay() === 1 &&
                        end.getDay() === 0 &&
                        Math.round(
                            (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) -
                                Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) /
                                86400000
                        ) === 6
                    const calendarMonth =
                        preset === 'month' &&
                        start.getDate() === 1 &&
                        start.getFullYear() === end.getFullYear() &&
                        start.getMonth() === end.getMonth() &&
                        end.getDate() === new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate()
                    const calendarYear =
                        preset === 'year' &&
                        start.getFullYear() === end.getFullYear() &&
                        start.getMonth() === 0 && start.getDate() === 1 &&
                        end.getMonth() === 11 && end.getDate() === 31
                    return (
                        <button
                            key={preset}
                            type="button"
                            aria-pressed={
                                calendarWeek ||
                                calendarMonth ||
                                calendarYear ||
                                (candidate.startDate === value.startDate && candidate.endDate === value.endDate)
                            }
                            onClick={() => {
                                onChange(candidate)
                            }}
                        >
                            {t(`preset_${preset}`)}
                        </button>
                    )
                })}
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
                    disabled={!canAdvance}
                    onClick={() => {
                        if (canAdvance) onChange(nextRange)
                    }}
                >
                    <ChevronRight size={18} aria-hidden />
                </button>
            </div>
        </div>
    )
}
