import type { DashboardWidget } from '@/entities/Report'

export const sizeToW = (size: string): number => {
    switch (size) {
        case 'sm': return 3
        case 'md': return 6
        case 'lg': return 12
        default: return 4
    }
}

export const sizeToH = (widgetType: string): number => {
    switch (widgetType) {
        case 'stat-card': return 2
        case 'sparkline': return 2
        case 'bar-chart': return 4
        case 'line-chart': return 4
        case 'pie-chart': return 4
        case 'heatmap': return 4
        case 'tag-cloud': return 3
        default: return 3
    }
}

export function buildWidgetLayouts(widgets: DashboardWidget[], isStatic = true) {
    return {
        lg: widgets.map((widget, index) => ({
            i: widget.id,
            x: (index * sizeToW(widget.size)) % 12,
            y: Math.floor((index * sizeToW(widget.size)) / 12),
            w: sizeToW(widget.size),
            h: sizeToH(widget.widgetType),
            minW: 2,
            maxW: 12,
            static: isStatic,
        })),
    }
}
