import { memo } from 'react'
import type { PanelEntry } from '../../../model/panelStack'
import { CallPanelBody } from './CallPanelBody'
import { OperatorMetricPanelBody, OperatorPanelBody, type DashboardFilters } from './OperatorPanelBody'
import { TagPanelBody } from './TagPanelBody'

export interface DrilldownPanelProps {
    entry: PanelEntry
    filters: DashboardFilters
    onSelectMetric: (metricId: string, metricLabel: string) => void
    onOpenCall: (channelId: string, fromLabel: string) => void
}

export const DrilldownPanel = memo((props: DrilldownPanelProps) => {
    const { entry, filters, onSelectMetric, onOpenCall } = props

    switch (entry.kind) {
        case 'operator':
            return (
                <OperatorPanelBody
                    entry={entry}
                    filters={filters}
                    onSelectMetric={onSelectMetric}
                />
            )
        case 'operatorMetric':
            return (
                <OperatorMetricPanelBody
                    entry={entry}
                    filters={filters}
                    onOpenCall={onOpenCall}
                />
            )
        case 'call':
            return <CallPanelBody channelId={entry.channelId} />
        case 'tag':
            return (
                <TagPanelBody
                    entry={entry}
                    filters={filters}
                    onOpenCall={onOpenCall}
                />
            )
        default: {
            const _exhaustive: never = entry
            return _exhaustive
        }
    }
})
