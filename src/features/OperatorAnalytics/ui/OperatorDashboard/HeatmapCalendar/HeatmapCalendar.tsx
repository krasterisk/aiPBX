import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Card } from '@/shared/ui/redesigned/Card'
import cls from './HeatmapCalendar.module.scss'

interface DayData {
    date: string // YYYY-MM-DD
    callCount: number
    avgScore: number // 0–100
}

interface HeatmapCalendarProps {
    data: DayData[]
    startDate?: string
    endDate?: string
}

const getScoreColor = (score: number): string => {
    if (score >= 80) return 'var(--status-success)'
    if (score >= 50) return 'var(--status-warning)'
    return 'var(--status-error)'
}

const getOpacity = (count: number, maxCount: number): number => {
    if (!maxCount || !count) return 0.1
    return Math.max(0.2, count / maxCount)
}

const CELL_SIZE = 10
const CELL_GAP = 2
const LEFT_OFFSET = 30
const TOP_OFFSET = 20
const DAYS_LABELS = ['Пн', '', 'Ср', '', 'Пт', '', 'Вс']

export const HeatmapCalendar = memo(({ data, startDate, endDate }: HeatmapCalendarProps) => {
    const { t, i18n } = useTranslation('reports')

    const { grid, maxCount, monthLabels } = useMemo(() => {
        const map = new Map<string, DayData>()
        data.forEach(d => map.set(d.date, d))

        let refDate = new Date()
        if (startDate) refDate = new Date(startDate)
        else if (endDate) refDate = new Date(endDate)
        else if (data.length > 0) refDate = new Date(data[data.length - 1].date)

        const calStartDate = new Date(refDate)
        calStartDate.setMonth(0, 1) // Jan 1st
        calStartDate.setHours(0, 0, 0, 0)
        
        const calEndDate = new Date(refDate)
        calEndDate.setMonth(11, 31) // Dec 31st
        calEndDate.setHours(23, 59, 59, 999)

        // Align to Monday
        const dayOfWeek = calStartDate.getDay()
        calStartDate.setDate(calStartDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
        
        // Align end to Sunday
        const dayOfWeekEnd = calEndDate.getDay()
        if (dayOfWeekEnd !== 0) {
            calEndDate.setDate(calEndDate.getDate() + (7 - dayOfWeekEnd))
        }

        const grid: Array<Array<{ date: string, count: number, score: number }>> = []
        let maxCount = 0
        const monthLabels: Array<{ label: string, week: number }> = []
        let lastMonth = -1

        const current = new Date(calStartDate)
        let weekIdx = 0
        const endTime = calEndDate.getTime()

        while (current.getTime() <= endTime) {
            const week: typeof grid[0] = []
            for (let d = 0; d < 7; d++) {
                const key = current.toISOString().slice(0, 10)
                const day = map.get(key)
                const count = day?.callCount ?? 0
                const score = day?.avgScore ?? 0
                if (count > maxCount) maxCount = count
                week.push({ date: key, count, score })

                // Month label - adding only on Monday to align with column
                const month = current.getMonth()
                if (month !== lastMonth && d === 0) {
                    // Prevent overlapping labels: if previous label is too close, remove it
                    if (monthLabels.length > 0 && weekIdx - monthLabels[monthLabels.length - 1].week < 3) {
                        monthLabels.pop()
                    }
                    
                    monthLabels.push({
                        label: current.toLocaleDateString(i18n.language, { month: 'short' }),
                        week: weekIdx
                    })
                    lastMonth = month
                }

                current.setDate(current.getDate() + 1)
            }
            grid.push(week)
            weekIdx++
        }

        return { grid, maxCount, monthLabels }
    }, [data, startDate, endDate, i18n.language])

    const totalWidth = grid.length * (CELL_SIZE + CELL_GAP) + LEFT_OFFSET
    const totalHeight = 7 * (CELL_SIZE + CELL_GAP) + TOP_OFFSET

    return (
        <Card max fullHeight variant={'glass'} border={'partial'} padding={'24'}>
            <VStack gap={'12'} max>
                <Text title={String(t('Активность'))} bold />
                {/* viewBox + width="100%" растягивает SVG на всю ширину карточки */}
                <svg
                    viewBox={`0 0 ${totalWidth} ${totalHeight}`}
                    preserveAspectRatio="xMinYMin meet"
                    className={cls.heatmap}
                >
                    {/* Day labels */}
                    {DAYS_LABELS.map((label, i) => (
                        label && (
                            <text
                                key={i}
                                x={0}
                                y={TOP_OFFSET + i * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2}
                                className={cls.dayLabel}
                                dominantBaseline={'middle'}
                            >
                                {t(label)}
                            </text>
                        )
                    ))}

                    {/* Month labels */}
                    {monthLabels.map(({ label, week }, i) => (
                        <text
                            key={i}
                            x={LEFT_OFFSET + week * (CELL_SIZE + CELL_GAP)}
                            y={10}
                            className={cls.monthLabel}
                        >
                            {label}
                        </text>
                    ))}

                    {/* Cells */}
                    {grid.map((week, wIdx) =>
                        week.map((day, dIdx) => (
                            <rect
                                key={`${wIdx}-${dIdx}`}
                                x={LEFT_OFFSET + wIdx * (CELL_SIZE + CELL_GAP)}
                                y={TOP_OFFSET + dIdx * (CELL_SIZE + CELL_GAP)}
                                width={CELL_SIZE}
                                height={CELL_SIZE}
                                rx={2}
                                ry={2}
                                fill={day.count > 0 ? getScoreColor(day.score) : 'var(--glass-border-secondary)'}
                                opacity={day.count > 0 ? getOpacity(day.count, maxCount) : 0.3}
                                className={cls.cell}
                            >
                                <title>{`${day.date}\n${t('Звонков')}: ${day.count}\n${t('Средняя оценка')}: ${day.score}`}</title>
                            </rect>
                        ))
                    )}
                </svg>
            </VStack>
        </Card>
    )
})
