import { memo, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronUp, UserRound } from 'lucide-react'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import type { OperatorTopicStats } from '@/entities/Report'
import { HStack, VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Table } from '@/shared/ui/redesigned/Table'
import { Button } from '@/shared/ui/redesigned/Button'
import { Textarea } from '@/shared/ui/mui/Textarea'
import { Combobox } from '@/shared/ui/mui/Combobox'
import { Check } from '@/shared/ui/mui/Check'
import { DashboardHint } from '../DashboardHint'
import { heatLevel, operatorInitials, topicTone } from './topicVisual'
import visuals from './TopicVisuals.module.scss'
import cls from './OperatorTopics.module.scss'

export type SelectTopicOperator = (operatorName: string, element: HTMLElement | null) => void
export type SelectTopicCalls = (tagId: string | null, operatorName: string | null | undefined, callsCount: number, element?: HTMLElement) => void
type OperatorRow = OperatorTopicStats['operators'][number]
export interface TopicChoice { id: string, label: string }
export const topicCountHint = (t: (key: string) => string, multiple = false) =>
    [t('OPERATOR_TOPICS_COUNT_HINT'), multiple ? t('OPERATOR_TOPICS_MULTIPLE_HINT') : ''].filter(Boolean).join('\n\n')

interface MatrixProps { stats: OperatorTopicStats, onSelect: SelectTopicCalls, onSelectOperator?: SelectTopicOperator }
const DEFAULT_SORT = { id: 'callsCount', desc: true }

export const OperatorTopicMatrix = memo(({ stats, onSelect, onSelectOperator }: MatrixProps) => {
    const { t } = useTranslation('reports')
    const [search, setSearch] = useState('')
    const [hiddenTopics, setHiddenTopics] = useState<Array<string | null>>([])
    const [sorting, setSorting] = useState<SortingState>([DEFAULT_SORT])
    const operatorLabel = (name: string | null) => name ?? String(t('Без оператора'))
    const topics = stats.topics.filter(topic => !hiddenTopics.includes(topic.tagId))
    const sort = sorting[0] ?? DEFAULT_SORT
    const rows = useMemo(() => {
        const query = search.trim().toLocaleLowerCase()
        return stats.operators.filter(row => (row.operatorName ?? String(t('Без оператора'))).toLocaleLowerCase().includes(query))
            .sort((a, b) => {
                if (sort?.id === 'operatorName') return (sort.desc ? -1 : 1) * (a.operatorName ?? String(t('Без оператора'))).localeCompare(b.operatorName ?? String(t('Без оператора')))
                const topic = stats.topics.find(item => `topic:${JSON.stringify(item.tagId)}` === sort?.id)
                const value = (row: OperatorRow) => topic ? row.topics.find(cell => cell.tagId === topic.tagId)?.callsCount ?? 0 : row.callsCount
                return (!sort?.desc ? 1 : -1) * (value(a) - value(b))
            })
    }, [stats, search, sort, t])

    const countButton = (tagId: string | null, name: string | null | undefined, count: number, label: string, maximum: number) => count > 0
        ? <Button variant="clear" size="s" className={`${cls.countButton} ${visuals[topicTone(tagId)]} ${cls[heatLevel(count, maximum)]}`} aria-label={label} onClick={e => { onSelect(tagId, name, count, e.currentTarget) }}>{count}</Button>
        : <Text text="0" size="s" className={cls.zero} />
    const columns: Array<ColumnDef<OperatorRow>> = [
        {
            id: 'operatorName',
            enableMultiSort: false,
            accessorFn: row => operatorLabel(row.operatorName),
            header: String(t('Оператор')),
            cell: info => {
                const name = info.row.original.operatorName
                const identity = <HStack gap="8" className={visuals.identity}>
                    <span className={visuals.avatar} aria-hidden>{operatorInitials(name) || <UserRound size={16} />}</span>
                    <Text text={operatorLabel(name)} bold size="s" />
                </HStack>
                return onSelectOperator
                    ? <Button variant="clear" size="s" className={cls.operatorButton} aria-label={operatorLabel(name)} onClick={e => { onSelectOperator(name ?? 'Unknown Operator', e.currentTarget) }}>{identity}</Button>
                    : identity
            },
            footer: () => <Text text={String(t('Всего по проекту'))} bold />
        },
        ...topics.map(topic => {
            const name = topic.tagId === null ? String(t('Без темы')) : topic.name
            const maximum = Math.max(1, ...stats.operators.map(row => row.topics.find(cell => cell.tagId === topic.tagId)?.callsCount ?? 0))
            return {
                id: `topic:${JSON.stringify(topic.tagId)}`,
                enableMultiSort: false,
                accessorFn: (row: OperatorRow) => row.topics.find(cell => cell.tagId === topic.tagId)?.callsCount ?? 0,
                header: name,
                cell: info => countButton(topic.tagId, info.row.original.operatorName, Number(info.getValue()), `${operatorLabel(info.row.original.operatorName)} / ${name}: ${info.getValue()}`, maximum),
                footer: () => countButton(topic.tagId, undefined, topic.callsCount, `${String(t('Все операторы'))} / ${name}: ${topic.callsCount}`, maximum),
            } satisfies ColumnDef<OperatorRow>
        }),
        {
            id: 'callsCount',
            enableMultiSort: false,
            accessorKey: 'callsCount',
            header: String(t('Всего звонков')),
            cell: info => <Text text={String(info.row.original.callsCount)} bold className={visuals.total} />,
            footer: () => <Text text={String(stats.totalCalls)} bold className={visuals.total} />
        },
    ]
    const sortOptions: TopicChoice[] = columns.map(column => ({ id: column.id!, label: String(column.header) }))
    return (
        <VStack gap="16" max data-testid="operator-topic-matrix">
            <HStack gap="8" wrap="wrap">
                <Text title={String(t('Операторы по темам'))} bold />
                <DashboardHint hint={topicCountHint(key => String(t(key)), stats.hasMultipleTopics)} />
            </HStack>
            <HStack gap="16" max wrap="wrap" justify="between" className={cls.toolbar}>
                <Textarea type="search" label={String(t('Поиск оператора'))} value={search} onChange={e => { setSearch(e.target.value) }} className={cls.search} />
                <HStack gap="8" wrap="wrap">
                    <Text text={String(t('TOPIC_HEAT_LESS'))} size="xs" />
                    <HStack gap="4" aria-hidden>{[1, 2, 3, 4].map(level => <span key={level} className={`${cls.heatSwatch} ${cls[`heat${level}`]} ${visuals.tone0}`} />)}</HStack>
                    <Text text={String(t('TOPIC_HEAT_MORE'))} size="xs" />
                    <DashboardHint hint={String(t('TOPIC_HEAT_HINT'))} label={String(t('TOPIC_HEAT_LEGEND'))} />
                </HStack>
            </HStack>
            <details className={cls.columnPicker}>
                <summary>{String(t('Выбрать темы'))}</summary>
                <HStack gap="16" wrap="wrap" max className={cls.checkboxes}>
                    {stats.topics.map(topic => <Check key={JSON.stringify(topic.tagId)} size="small" label={topic.tagId === null ? String(t('Без темы')) : topic.name}
                        checked={!hiddenTopics.includes(topic.tagId)} onChange={(_, checked) => {
                            setHiddenTopics(previous => checked ? previous.filter(id => id !== topic.tagId) : [...previous, topic.tagId])
                        }} />)}
                </HStack>
            </details>
            <HStack gap="8" max className={cls.mobileSort}>
                <Combobox options={sortOptions} value={sortOptions.find(option => option.id === sort?.id) ?? sortOptions[0]} disableClearable
                    getOptionLabel={(option: TopicChoice) => option.label} isOptionEqualToValue={(a: TopicChoice, b: TopicChoice) => a.id === b.id}
                    label={String(t('Сортировать по'))} className={cls.selector}
                    onChange={(_, option: TopicChoice) => { setSorting([{ id: option.id, desc: sort?.desc ?? true }]) }} />
                <Button variant="clear" aria-label={String(t(!sort.desc ? 'По возрастанию' : 'По убыванию'))}
                    addonLeft={!sort.desc ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    onClick={() => { setSorting([{ id: sort.id, desc: !sort.desc }]) }} />
            </HStack>
            <Table data={rows} columns={columns} sorting={sorting} setSorting={setSorting} accessibleSort className={cls.matrix} />
            {!rows.length && <Text text={String(t('OPERATOR_SCORE_NO_MATCH'))} size="s" />}
            <Text text={`${String(t('Всего звонков'))}: ${stats.totalCalls}`} size="s" />
        </VStack>
    )
})

interface BreakdownProps { stats?: OperatorTopicStats, tagId?: string | null, operatorName?: string, onSelect?: SelectTopicCalls }
interface BreakdownRow { label: string, tagId: string | null, operatorName: string | null, count: number }

export const TopicBreakdown = memo(({ stats, tagId, operatorName, onSelect }: BreakdownProps) => {
    const { t } = useTranslation('reports')
    if (!stats || !onSelect) return null
    const name = operatorName?.trim()
    const operator = name === 'Unknown Operator' || !name ? null : name
    const operatorRow = stats.operators.find(row => row.operatorName === operator)
    const rows: BreakdownRow[] = tagId !== undefined
        ? stats.operators.map(row => ({ label: row.operatorName ?? String(t('Без оператора')), tagId, operatorName: row.operatorName, count: row.topics.find(cell => cell.tagId === tagId)?.callsCount ?? 0 }))
        : stats.topics.map(topic => ({ label: topic.tagId === null ? String(t('Без темы')) : topic.name, tagId: topic.tagId, operatorName: operator, count: operatorRow?.topics.find(cell => cell.tagId === topic.tagId)?.callsCount ?? 0 }))
    const total = tagId !== undefined ? stats.topics.find(topic => topic.tagId === tagId)?.callsCount ?? 0 : operatorRow?.callsCount ?? 0
    const populated = rows.filter(row => row.count > 0).sort((a, b) => b.count - a.count)
    const share = (count: number) => total ? (count / total * 100).toFixed(1) : '0.0'
    const columns: Array<ColumnDef<BreakdownRow>> = [
        {
 accessorKey: 'label',
header: String(t(tagId !== undefined ? 'Оператор' : 'Тема')),
cell: info => <HStack gap="8" className={`${visuals.identity} ${visuals[topicTone(info.row.original.tagId)]}`}>
            <span className={visuals.dot} aria-hidden /><Text text={info.row.original.label} bold size="s" />
        </HStack>,
enableSorting: false 
},
        {
            accessorKey: 'count',
            header: String(t('Звонков')),
            cell: info => {
                const row = info.row.original
                return <Button variant="clear" size="s" className={cls.countButton} aria-label={`${row.label} ${row.count} (${share(row.count)}%)`}
                    onClick={e => { onSelect(row.tagId, row.operatorName, row.count, e.currentTarget) }}>{row.count}</Button>
            },
            enableSorting: false
        },
        {
 id: 'share',
header: String(t('Доля')),
cell: info => <VStack gap="4" className={`${visuals.share} ${visuals[topicTone(info.row.original.tagId)]}`}>
            <Text text={`${share(info.row.original.count)}%`} size="s" bold />
            <svg viewBox="0 0 100 6" preserveAspectRatio="none" className={visuals.shareTrack} aria-hidden>
                <rect width="100" height="6" rx="3" />
                <rect width={Number(share(info.row.original.count))} height="6" rx="3" className={visuals.shareFill} />
            </svg>
        </VStack>,
enableSorting: false 
},
    ]
    return (
        <VStack gap="8" max data-testid="topic-breakdown">
            <HStack gap="8" wrap="wrap">
                <Text title={String(t(tagId !== undefined ? 'Операторы по теме' : 'Темы оператора'))} bold />
                <DashboardHint hint={topicCountHint(key => String(t(key)), tagId === undefined && stats.hasMultipleTopics)} />
            </HStack>
            <Table data={populated} columns={columns} className={cls.breakdown} />
            {!populated.length && <Text text={String(t('Звонков за период нет'))} size="s" />}
        </VStack>
    )
})
