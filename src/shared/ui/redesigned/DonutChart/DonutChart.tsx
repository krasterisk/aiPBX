import { memo, useState, useCallback } from 'react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'

export interface DonutSegment {
    id: number | string
    value: number
    label: string
    color: string
}

export interface DonutChartProps {
    data: DonutSegment[]
    /** Diameter of the chart in px @default 200 */
    size?: number
    /** Inner radius of the donut hole @default 50 */
    innerRadius?: number
    className?: string
}

/**
 * Static donut chart — pure SVG, no JS animation, no CSS transition on paths.
 * Includes hover tooltip with label, value and percentage.
 */
export const DonutChart = memo(({ data, size = 200, innerRadius = 50 }: DonutChartProps) => {
    const outerRadius = size / 2 - 4
    const cx = size / 2
    const cy = size / 2
    const total = data.reduce((acc, d) => acc + d.value, 0)

    const [hovered, setHovered] = useState<number | null>(null)
    const [mouse, setMouse] = useState({ x: 0, y: 0 })

    const onMouseMove = useCallback((e: React.MouseEvent<SVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }, [])

    if (total === 0) return null

    // Build arcs
    let startAngle = -Math.PI / 2
    const arcs = data.map((segment, idx) => {
        const angle = (segment.value / total) * 2 * Math.PI
        const endAngle = startAngle + angle

        const x1 = cx + outerRadius * Math.cos(startAngle)
        const y1 = cy + outerRadius * Math.sin(startAngle)
        const x2 = cx + outerRadius * Math.cos(endAngle)
        const y2 = cy + outerRadius * Math.sin(endAngle)

        const ix1 = cx + innerRadius * Math.cos(endAngle)
        const iy1 = cy + innerRadius * Math.sin(endAngle)
        const ix2 = cx + innerRadius * Math.cos(startAngle)
        const iy2 = cy + innerRadius * Math.sin(startAngle)

        const largeArc = angle > Math.PI ? 1 : 0

        const d = [
            `M ${x1} ${y1}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
            `L ${ix1} ${iy1}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2}`,
            'Z'
        ].join(' ')

        const result = { ...segment, d, idx, pct: ((segment.value / total) * 100).toFixed(1) }
        startAngle = endAngle
        return result
    })

    const hoveredArc = hovered !== null ? arcs[hovered] : null

    return (
        <VStack gap={'12'} max align={'center'}>
            <svg
                viewBox={`0 0 ${size} ${size}`}
                width={size}
                height={size}
                style={{ overflow: 'visible', position: 'relative' }}
                onMouseMove={onMouseMove}
                onMouseLeave={() => setHovered(null)}
            >
                {arcs.map(arc => (
                    <path
                        key={arc.id}
                        d={arc.d}
                        fill={arc.color}
                        stroke="none"
                        opacity={hovered === null || hovered === arc.idx ? 1 : 0.3}
                        style={{
                            filter: hovered === arc.idx ? 'brightness(1.15)' : 'none',
                            transition: 'opacity 0.15s ease, filter 0.15s ease',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={() => setHovered(arc.idx)}
                    />
                ))}
            </svg>

            {/* Tooltip */}
            {hoveredArc && (
                <div
                    style={{
                        position: 'absolute',
                        left: mouse.x + 12,
                        top: mouse.y - 40,
                        pointerEvents: 'none',
                        zIndex: 10,
                        background: 'var(--bg-redesigned)',
                        border: '1px solid var(--glass-border-secondary)',
                        borderRadius: 'var(--radius-m)',
                        padding: '6px 12px',
                        boxShadow: 'var(--shadow-m)',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <span style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: hoveredArc.color,
                        display: 'inline-block',
                        flexShrink: 0,
                    }} />
                    <span style={{ color: 'var(--text-redesigned)', fontSize: 13 }}>
                        {hoveredArc.label}: <b>{hoveredArc.value}</b> ({hoveredArc.pct}%)
                    </span>
                </div>
            )}

            {/* Legend */}
            <HStack gap={'16'} wrap={'wrap'} justify={'center'}>
                {data.map(item => (
                    <HStack key={item.id} gap={'8'} align={'center'}>
                        <svg width={12} height={12}>
                            <circle cx={6} cy={6} r={6} fill={item.color} />
                        </svg>
                        <Text text={item.label} size={'s'} />
                    </HStack>
                ))}
            </HStack>
        </VStack>
    )
})
