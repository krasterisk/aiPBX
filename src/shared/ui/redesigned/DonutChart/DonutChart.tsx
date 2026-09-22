import { memo, useState, useCallback, KeyboardEvent } from 'react'
import { VStack, HStack } from '../Stack'
import { Text } from '../Text'

function polar(cx: number, cy: number, radius: number, angle: number): [number, number] {
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]
}

function ringSlicePath(
    cx: number,
    cy: number,
    outerRadius: number,
    innerRadius: number,
    startAngle: number,
    endAngle: number,
    angle: number,
): string {
    const [x1, y1] = polar(cx, cy, outerRadius, startAngle)
    const [x2, y2] = polar(cx, cy, outerRadius, endAngle)
    const [ix1, iy1] = polar(cx, cy, innerRadius, endAngle)
    const [ix2, iy2] = polar(cx, cy, innerRadius, startAngle)
    const largeArc = angle > Math.PI ? 1 : 0

    return [
        `M ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${ix1} ${iy1}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2}`,
        'Z',
    ].join(' ')
}

function fullRingPath(
    cx: number,
    cy: number,
    outerRadius: number,
    innerRadius: number,
    startAngle: number,
): string {
    const mid = startAngle + Math.PI
    const end = startAngle + Math.PI * 2
    const [ox1, oy1] = polar(cx, cy, outerRadius, startAngle)
    const [oxm, oym] = polar(cx, cy, outerRadius, mid)
    const [ox2, oy2] = polar(cx, cy, outerRadius, end)
    const [ix2, iy2] = polar(cx, cy, innerRadius, end)
    const [ixm, iym] = polar(cx, cy, innerRadius, mid)
    const [ix1, iy1] = polar(cx, cy, innerRadius, startAngle)

    return [
        `M ${ox1} ${oy1}`,
        `A ${outerRadius} ${outerRadius} 0 1 1 ${oxm} ${oym}`,
        `A ${outerRadius} ${outerRadius} 0 1 1 ${ox2} ${oy2}`,
        `L ${ix2} ${iy2}`,
        `A ${innerRadius} ${innerRadius} 0 1 0 ${ixm} ${iym}`,
        `A ${innerRadius} ${innerRadius} 0 1 0 ${ix1} ${iy1}`,
        'Z',
    ].join(' ')
}

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
    onSegmentClick?: (segment: DonutSegment) => void
}

/**
 * Donut chart - pure SVG. Hover tooltip; optional segment/legend click for drilldown.
 */
export const DonutChart = memo(({
    data,
    size = 200,
    innerRadius = 50,
    onSegmentClick,
}: DonutChartProps) => {
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

    const activate = useCallback((segment: DonutSegment) => {
        if (!onSegmentClick || segment.value <= 0) return
        onSegmentClick(segment)
    }, [onSegmentClick])

    const onLegendKeyDown = useCallback((e: KeyboardEvent, segment: DonutSegment) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            activate(segment)
        }
    }, [activate])

    if (total === 0) return null

    // Build arcs. A single 100% segment must be two semicircles: an SVG arc
    // whose start and end are the same point draws nothing, so 0% and 100%
    // success looked like an empty chart.
    let startAngle = -Math.PI / 2
    const arcs = data.map((segment, idx) => {
        const angle = (segment.value / total) * 2 * Math.PI
        const endAngle = startAngle + angle
        const d = angle >= Math.PI * 2 - 1e-6
            ? fullRingPath(cx, cy, outerRadius, innerRadius, startAngle)
            : ringSlicePath(cx, cy, outerRadius, innerRadius, startAngle, endAngle, angle)

        const result = { ...segment, d, idx, pct: ((segment.value / total) * 100).toFixed(1) }
        startAngle = endAngle
        return result
    })

    const hoveredArc = hovered !== null ? arcs[hovered] : null
    const clickable = Boolean(onSegmentClick)

    return (
        <VStack gap={'12'} max align={'center'}>
            <svg
                viewBox={`0 0 ${size} ${size}`}
                width={size}
                height={size}
                style={{ overflow: 'visible', position: 'relative' }}
                onMouseMove={onMouseMove}
                onMouseLeave={() => { setHovered(null) }}
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
                            cursor: clickable && arc.value > 0 ? 'pointer' : 'default',
                        }}
                        onMouseEnter={() => { setHovered(arc.idx) }}
                        onClick={() => { activate(arc) }}
                        data-testid={`donut-segment-${arc.id}`}
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
                    <HStack
                        key={item.id}
                        gap={'8'}
                        align={'center'}
                        role={clickable ? 'button' : undefined}
                        tabIndex={clickable && item.value > 0 ? 0 : undefined}
                        onClick={clickable ? () => { activate(item) } : undefined}
                        onKeyDown={clickable ? (e) => { onLegendKeyDown(e, item) } : undefined}
                        data-testid={`donut-legend-${item.id}`}
                        style={clickable && item.value > 0 ? { cursor: 'pointer' } : undefined}
                    >
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
