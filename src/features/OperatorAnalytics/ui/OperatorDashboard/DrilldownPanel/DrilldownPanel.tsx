import { memo } from 'react'
import type { OperatorProject, OperatorTopicStats } from '@/entities/Report'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { TopicBreakdown, type SelectTopicCalls } from '../OperatorTopics/OperatorTopics'
import type { PanelEntry } from '../../../model/panelStack'
import { CallPanelBody } from './CallPanelBody'
import { DistributionPanelBody } from './DistributionPanelBody'
import { OperatorMetricPanelBody, OperatorPanelBody, type DashboardFilters } from './OperatorPanelBody'
import { TagPanelBody } from './TagPanelBody'

export interface DrilldownPanelProps {
    entry: PanelEntry
    filters: DashboardFilters
    project?: OperatorProject
    topicStats?: OperatorTopicStats
    onSelectTopicCalls?: SelectTopicCalls
    onSelectMetric: (metricId: string, metricLabel: string) => void
    onOpenCall: (channelId: string, fromLabel: string) => void
}

export const DrilldownPanel = memo((props: DrilldownPanelProps) => {
    const { entry, filters, project, topicStats, onSelectTopicCalls, onSelectMetric, onOpenCall } = props

    switch (entry.kind) {
        case 'operator':
            return (
                <VStack gap="24" max>
                    <TopicBreakdown stats={topicStats} operatorName={entry.operatorName} onSelect={onSelectTopicCalls} />
                    <OperatorPanelBody
                        entry={entry}
                        filters={filters}
                        onSelectMetric={onSelectMetric}
                    />
                </VStack>
            )
        case 'operatorMetric':
            return (
                <OperatorMetricPanelBody
                    entry={entry}
                    filters={filters}
                    description={project?.customMetricsSchema?.find(metric => metric.id === entry.metricId)?.description}
                    onOpenCall={onOpenCall}
                />
            )
        case 'call':
            return <CallPanelBody channelId={entry.channelId} />
        case 'tag':
            return (
                <VStack gap="24" max>
                    <TopicBreakdown stats={topicStats} tagId={entry.stat.tagId} onSelect={onSelectTopicCalls} />
                    <TagPanelBody
                        key={entry.stat.tagId}
                        entry={entry}
                        filters={filters}
                        project={project}
                        onOpenCall={onOpenCall}
                    />
                </VStack>
            )
        case 'topicCalls':
            return <VStack gap="24" max>
                {entry.operatorName === undefined && <TopicBreakdown stats={topicStats} tagId={entry.tagId} onSelect={onSelectTopicCalls} />}
                <TagPanelBody key={JSON.stringify({ tagId: entry.tagId, operatorName: entry.operatorName })} entry={entry} filters={filters} project={project} onOpenCall={onOpenCall} />
            </VStack>
        case 'distribution':
            return (
                <DistributionPanelBody
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
