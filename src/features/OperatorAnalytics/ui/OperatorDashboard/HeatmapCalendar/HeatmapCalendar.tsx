import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Card } from '@/shared/ui/redesigned/Card'
import cls from './HeatmapCalendar.module.scss'

interface DayData {
    date: string      // YYYY-MM-DD
    callCount: number
    avgScore: number   // 0–100
}

interface HeatmapCalendarProps {
    data: DayData[]
    weeks?: number
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

const CELL_SIZE = 14
const CELL_GAP = 3
const DAYS_LABELS = ['Пн', '', 'Ср', '', 'Пт', '', 'Вс']

export const HeatmapCalendar = memo(({ data, weeks = 26 }: HeatmapCalendarProps) => {
    const { t } = useTranslation('reports')

    const { grid, maxCount, monthLabels } = useMemo(() => {
        const map = new Map<string, DayData>()
        data.forEach(d => map.set(d.date, d))

        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - weeks * 7)
        // Align to Monday
        const dayOfWeek = startDate.getDay()
        startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

        const grid: Array<Array<{ date: string; count: number; score: number }>> = []
        let maxCount = 0
        const monthLabels: Array<{ label: string; week: number }> = []
        let lastMonth = -1

        const current = new Date(startDate)
        let weekIdx = 0

        while (current <= endDate) {
            const week: typeof grid[0] = []
            for (let d = 0; d < 7; d++) {
                const key = current.toISOString().slice(0, 10)
                const day = map.get(key)
                const count = day?.callCount ?? 0
                const score = day?.avgScore ?? 0
                if (count > maxCount) maxCount = count
                week.push({ date: key, count, score })

                // Month label
                const month = current.getMonth()
                if (month !== lastMonth && d === 0) {
                    monthLabels.push({
                        label: current.toLocaleDateString(undefined, { month: 'short' }),
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
    }, [data, weeks])

    const totalWidth = grid.length * (CELL_SIZE + CELL_GAP) + 30
    const totalHeight = 7 * (CELL_SIZE + CELL_GAP) + 24

    return (
        <Card max variant={'glass'} border={'partial'} padding={'24'}>
            <VStack gap={'12'} max>
                <Text title={String(t('Активность'))} bold />
                <div className={cls.heatmapWrapper}>
                    <svg width={totalWidth} height={totalHeight} className={cls.heatmap}>
                        {/* Day labels */}
                        {DAYS_LABELS.map((label, i) => (
                            label && (
                                <text
                                    key={i}
                                    x={0}
                                    y={24 + i * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2}
                                    className={cls.dayLabel}
                                    dominantBaseline={'middle'}
                                >
                                    {label}
                                </text>
                            )
                        ))}

                        {/* Month labels */}
                        {monthLabels.map(({ label, week }, i) => (
                            <text
                                key={i}
                                x={30 + week * (CELL_SIZE + CELL_GAP)}
                                y={12}
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
                                    x={30 + wIdx * (CELL_SIZE + CELL_GAP)}
                                    y={24 + dIdx * (CELL_SIZE + CELL_GAP)}
                                    width={CELL_SIZE}
                                    height={CELL_SIZE}
                                    rx={3}
                                    ry={3}
                                    fill={day.count > 0 ? getScoreColor(day.score) : 'var(--glass-border-secondary)'}
                                    opacity={day.count > 0 ? getOpacity(day.count, maxCount) : 0.3}
                                    className={cls.cell}
                                >
                                    <title>{`${day.date}\n${t('Звонков')}: ${day.count}\n${t('Средняя оценка')}: ${day.score}`}</title>
                                </rect>
                            ))
                        )}
                    </svg>
                </div>
            </VStack>
        </Card>
    )
})
