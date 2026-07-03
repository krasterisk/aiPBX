import { memo, useEffect, useMemo, useRef, useState } from 'react'
// @ts-ignore – react-grid-layout v2 types conflict with moduleResolution:node
import { Responsive } from 'react-grid-layout'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import type { DashboardWidget, OperatorDashboardResponse, OperatorProject } from '@/entities/Report'
import { WidgetRenderer } from './WidgetRenderer'
import { buildWidgetLayouts } from './dashboardGridLayout'
import cls from './DashboardBuilder.module.scss'

interface DashboardConfigGridProps {
    widgets: DashboardWidget[]
    dashboardData: OperatorDashboardResponse
    project?: OperatorProject
    title?: string
}

export const DashboardConfigGrid = memo((props: DashboardConfigGridProps) => {
    const { widgets, dashboardData, project, title } = props
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerWidth, setContainerWidth] = useState(0)

    const sortedWidgets = useMemo(
        () => [...widgets].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
        [widgets],
    )

    const layouts = useMemo(() => buildWidgetLayouts(sortedWidgets, true), [sortedWidgets])

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver(entries => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width)
            }
        })
        ro.observe(el)
        setContainerWidth(el.getBoundingClientRect().width)
        return () => { ro.disconnect() }
    }, [sortedWidgets.length])

    if (!sortedWidgets.length) return null

    return (
        <VStack gap={'12'} max data-tour-id="oa-custom-dashboard">
            {title && <Text title={title} bold />}
            <div ref={containerRef} className={cls.gridContainer}>
                {containerWidth > 0 && (
                    <Responsive
                        className="dashboard-grid"
                        width={containerWidth}
                        layouts={layouts}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
                        rowHeight={60}
                        margin={[12, 12]}
                    >
                        {sortedWidgets.map(widget => (
                            <div key={widget.id}>
                                <WidgetRenderer
                                    widget={widget}
                                    dashboardData={dashboardData}
                                    project={project}
                                />
                            </div>
                        ))}
                    </Responsive>
                )}
            </div>
        </VStack>
    )
})
