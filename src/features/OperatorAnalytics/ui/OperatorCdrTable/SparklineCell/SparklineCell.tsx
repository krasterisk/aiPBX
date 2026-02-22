import { memo } from 'react'
import cls from './SparklineCell.module.scss'

interface SparklineCellProps {
    /** 9 metric values in fixed order, 0-100 each */
    values: number[]
    /** Optional labels for each value, shown in tooltip */
    labels?: string[]
    width?: number
    height?: number
}

const BAR_COLORS = {
    high: 'var(--status-success)',
    mid: 'var(--status-warning)',
    low: 'var(--status-error)',
}

const getColor = (v: number) =>
    v >= 80 ? BAR_COLORS.high : v >= 50 ? BAR_COLORS.mid : BAR_COLORS.low

export const SparklineCell = memo(({ values, labels, width = 70, height = 24 }: SparklineCellProps) => {
    if (!values || values.length === 0) return <span>{'—'}</span>

    const barCount = values.length
    const gap = 1
    const barWidth = Math.max(2, (width - (barCount - 1) * gap) / barCount)

    return (
        <svg width={width} height={height} className={cls.sparkline} viewBox={`0 0 ${width} ${height}`}>
            {values.map((v, i) => {
                const barHeight = Math.max(2, (v / 100) * height)
                const x = i * (barWidth + gap)
                const y = height - barHeight
                const tooltipText = labels?.[i] ? `${labels[i]}: ${v}` : `${v}`
                return (
                    <rect
                        key={i}
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        rx={1}
                        fill={getColor(v)}
                        opacity={0.85}
                    >
                        <title>{tooltipText}</title>
                    </rect>
                )
            })}
        </svg>
    )
})
