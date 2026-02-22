import { memo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Card } from '@/shared/ui/redesigned/Card'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Modal } from '@/shared/ui/redesigned/Modal'
import { SearchInput } from '@/shared/ui/mui/SearchInput/SearchInput'
import { OperatorCdrResponse, OperatorAnalysisResult, OperatorProject } from '@/entities/Report'
import { useGetOperatorProjects } from '@/entities/Report'
import { PeriodPicker } from '@/entities/PeriodPicker'
import { OperatorCallDetail } from '../OperatorCallDetail/OperatorCallDetail'
import { OperatorUploadForm } from '../OperatorUploadForm/OperatorUploadForm'
import { OperatorCdrExtendedFilter } from './OperatorCdrExtendedFilter'
import { SparklineCell } from './SparklineCell/SparklineCell'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'
import cls from './OperatorCdrTable.module.scss'

// ─── Helpers ───────────────────────────────────────────────────────────────────

const SENTIMENT_COLORS: Record<string, string> = {
    Positive: 'var(--status-success)',
    Neutral: 'var(--status-warning)',
    Negative: 'var(--status-error)'
}

const calcAvgScore = (result: OperatorAnalysisResult): number | null => {
    const m = result.metrics
    if (!m) return null
    const nums = [
        m.greeting_quality, m.script_compliance, m.politeness_empathy,
        m.active_listening, m.objection_handling, m.product_knowledge,
        m.problem_resolution, m.speech_clarity_pace, m.closing_quality
    ]
    return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
}

const formatDuration = (sec?: number) => {
    if (!sec) return '—'
    const totalSeconds = Math.floor(sec)
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    if (h > 0) {
        return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${m}:${String(s).padStart(2, '0')}`
}

// ─── Row ───────────────────────────────────────────────────────────────────────

interface CdrRowProps {
    row: OperatorAnalysisResult
    colSpan: number
}

const CdrRow = memo(({ row, colSpan }: CdrRowProps) => {
    const { t } = useTranslation('reports')
    const [isExpanded, setIsExpanded] = useState(false)
    const avgScore = calcAvgScore(row)

    const toggle = useCallback(() => setIsExpanded(p => !p), [])

    return (
        <>
            <tr
                className={`${cls.ReportTableItem} ${isExpanded ? cls.rowExpanded : ''}`}
                onClick={toggle}
                id={`cdr-row-${row.id}`}
            >
                <td data-label={String(t('Дата'))}>
                    <Text text={new Intl.DateTimeFormat(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(row.createdAt))} />
                </td>
                <td data-label={String(t('Оператор'))}>
                    <Text text={row.operatorName || '—'} />
                </td>
                <td data-label={String(t('Проект'))}>
                    <Text text={row.project?.name || '—'} />
                </td>
                <td data-label={String(t('Длительность'))}>
                    <Text text={formatDuration(row.duration)} />
                </td>
                <td data-label={String(t('Настроение'))}>
                    <span
                        className={cls.sentiment}
                        style={{ color: SENTIMENT_COLORS[row.metrics?.customer_sentiment ?? ''] }}
                    >
                        {row.metrics?.customer_sentiment ? String(t(row.metrics.customer_sentiment)) : '—'}
                    </span>
                </td>
                <td data-label={String(t('Скоринг'))}>
                    {avgScore !== null ? (
                        <span
                            className={cls.scoreBadge}
                            data-level={avgScore >= 80 ? 'high' : avgScore >= 50 ? 'mid' : 'low'}
                        >
                            {avgScore}
                        </span>
                    ) : '—'}
                </td>
                <td data-label={String(t('Метрики'))}>
                    {row.metrics ? (
                        <SparklineCell
                            values={[
                                row.metrics.greeting_quality, row.metrics.script_compliance,
                                row.metrics.politeness_empathy, row.metrics.active_listening,
                                row.metrics.objection_handling, row.metrics.product_knowledge,
                                row.metrics.problem_resolution, row.metrics.speech_clarity_pace,
                                row.metrics.closing_quality
                            ]}
                            labels={[
                                String(t('Приветствие')), String(t('Следование скрипту')),
                                String(t('Вежливость')), String(t('Активное слушание')),
                                String(t('Работа с возражениями')), String(t('Знание продукта')),
                                String(t('Решение проблемы')), String(t('Чёткость речи')),
                                String(t('Завершение'))
                            ]}
                        />
                    ) : '—'}
                </td>
                <td data-label={String(t('Статус'))}>
                    <span className={cls.statusBadge} data-status={row.status}>
                        {String(t(row.status === 'completed' ? 'Завершено' : row.status === 'processing' ? 'Обработка' : 'Ошибка анализа'))}
                    </span>
                </td>
                <td className={cls.actionsTd} onClick={e => e.stopPropagation()}>
                    <div className={cls.actions}>
                        <Button variant={'clear'} onClick={toggle} id={`cdr-expand-${row.id}`}>
                            {isExpanded
                                ? <ChevronUp className={cls.expandIcon} size={18} />
                                : <ChevronDown className={cls.expandIcon} size={18} />
                            }
                        </Button>
                    </div>
                </td>
            </tr>
            {isExpanded && (
                <OperatorCallDetail record={row} colSpan={colSpan} />
            )}
        </>
    )
})

// ─── Header ────────────────────────────────────────────────────────────────────

interface OperatorCdrHeaderProps {
    tab?: string
    startDate?: string
    endDate?: string
    isInited?: boolean
    projectId?: string
    operatorName?: string
    search?: string
    onChangeTab: (v: string) => void
    onChangeStartDate: (v: string) => void
    onChangeEndDate: (v: string) => void
    onChangeProjectId: (v: string) => void
    onChangeOperatorName: (v: string) => void
    onChangeSearch: (v: string) => void
    onUpload: () => void
    onExport: () => void
}

export const OperatorCdrHeader = memo((props: OperatorCdrHeaderProps) => {
    const {
        tab, startDate, endDate, isInited, projectId, operatorName, search,
        onChangeTab, onChangeStartDate, onChangeEndDate,
        onChangeProjectId, onChangeOperatorName, onChangeSearch,
        onUpload, onExport
    } = props
    const { t } = useTranslation('reports')
    const [filterOpen, setFilterOpen] = useState(false)

    return (
        <VStack gap={'12'} max className={cls.Header}>
            {/* Row 1: Title + PeriodPicker */}
            <HStack max justify={'between'} align={'center'} gap={'16'} wrap={'wrap'} className={cls.headerContent}>
                <HStack className={cls.titleSection}>
                    <Text title={String(t('Записи звонков'))} size={'l'} bold />
                </HStack>

                <PeriodPicker
                    tab={tab}
                    isInited={isInited}
                    startDate={startDate}
                    endDate={endDate}
                    onChangeTab={onChangeTab}
                    onChangeStartDate={onChangeStartDate}
                    onChangeEndDate={onChangeEndDate}
                    onOpenFilters={() => setFilterOpen(true)}
                />
            </HStack>

            {/* Row 2: Search + Excel + Upload */}
            <HStack max justify={'between'} align={'center'} gap={'12'} wrap={'wrap'} className={cls.actionsRow}>
                <SearchInput
                    className={cls.searchInput}
                    placeholder={String(t('Поиск...')) ?? ''}
                    onChange={onChangeSearch}
                    value={search}
                />
                <HStack gap={'8'}>
                    <Button
                        variant={'clear'}
                        color={'success'}
                        addonLeft={<FileDownloadIcon fontSize={'small'} />}
                        onClick={onExport}
                    >
                        {String(t('Выгрузить в Excel'))}
                    </Button>
                    <Button
                        variant={'glass-action'}
                        addonLeft={<UploadFileIcon fontSize={'small'} />}
                        onClick={onUpload}
                    >
                        {String(t('Загрузить звонок'))}
                    </Button>
                </HStack>
            </HStack>

            <OperatorCdrExtendedFilter
                show={filterOpen}
                onClose={() => setFilterOpen(false)}
                startDate={startDate}
                endDate={endDate}
                projectId={projectId}
                operatorName={operatorName}
                onChangeStartDate={onChangeStartDate}
                onChangeEndDate={onChangeEndDate}
                onChangeProjectId={onChangeProjectId}
                onChangeOperatorName={onChangeOperatorName}
            />
        </VStack>
    )
})

// ─── Main Component ────────────────────────────────────────────────────────────

interface OperatorCdrTableProps {
    className?: string
    data?: OperatorCdrResponse
    isLoading?: boolean
    tab?: string
    startDate?: string
    endDate?: string
    isInited?: boolean
    projectId?: string
    page?: number
    search?: string
    sortField?: string
    sortOrder?: 'ASC' | 'DESC'
    onChangeTab?: (v: string) => void
    onChangeStartDate?: (v: string) => void
    onChangeEndDate?: (v: string) => void
    onChangeProjectId: (value: string) => void
    onChangePage: (value: number) => void
    onChangeSearch?: (value: string) => void
    onChangeSort?: (field: string, order: 'ASC' | 'DESC') => void
}

export const OperatorCdrTable = memo((props: OperatorCdrTableProps) => {
    const {
        data, isLoading, tab, startDate, endDate, isInited,
        projectId, page = 1, search = '', sortField = 'createdAt', sortOrder = 'DESC',
        onChangeTab, onChangeStartDate, onChangeEndDate,
        onChangeProjectId, onChangePage, onChangeSearch, onChangeSort
    } = props

    const { t } = useTranslation('reports')
    const [uploadOpen, setUploadOpen] = useState(false)
    const [operatorName, setOperatorName] = useState('')

    const COL_SPAN = 9

    const handleSort = (field: string) => {
        if (!onChangeSort) return
        const newOrder = sortField === field && sortOrder === 'ASC' ? 'DESC' : 'ASC'
        onChangeSort(field, newOrder)
    }

    const renderSortIcon = (field: string) => {
        if (sortField !== field) return null
        return sortOrder === 'ASC'
            ? <ChevronUp size={14} className={cls.sortIcon} />
            : <ChevronDown size={14} className={cls.sortIcon} />
    }

    const totalPages = data ? Math.ceil(data.total / 20) : 1

    const exportToExcel = useCallback(() => {
        if (!data?.data?.length) return
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
        const rows = data.data.map((row, i) => ({
            '№': i + 1,
            [String(t('Дата'))]: new Date(row.createdAt).toLocaleString(),
            [String(t('Оператор'))]: row.operatorName || '',
            [String(t('Проект'))]: row.project?.name || '',
            [String(t('Длительность'))]: formatDuration(row.duration),
            [String(t('Настроение клиента'))]: row.metrics?.customer_sentiment || '',
            [String(t('Скоринг'))]: calcAvgScore(row) ?? '',
            [String(t('Статус'))]: row.status || ''
        }))
        const ws = XLSX.utils.json_to_sheet(rows)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'CDR')
        const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        FileSaver.saveAs(new Blob([buf], { type: fileType }), 'operator_cdr.xlsx')
    }, [data, t])

    const rows = data?.data ?? []

    return (
        <VStack gap={'16'} max className={cls.OperatorCdrTable}>
            <OperatorCdrHeader
                tab={tab}
                startDate={startDate}
                endDate={endDate}
                isInited={isInited}
                projectId={projectId}
                operatorName={operatorName}
                search={search}
                onChangeTab={onChangeTab ?? (() => { })}
                onChangeStartDate={onChangeStartDate ?? (() => { })}
                onChangeEndDate={onChangeEndDate ?? (() => { })}
                onChangeProjectId={onChangeProjectId}
                onChangeOperatorName={setOperatorName}
                onChangeSearch={onChangeSearch ?? (() => { })}
                onUpload={() => setUploadOpen(true)}
                onExport={exportToExcel}
            />

            {/* Table */}
            {rows.length > 0 ? (
                <div className={cls.TableWrapper}>
                    <table className={cls.Table}>
                        <thead className={cls.TableHeader}>
                            <tr>
                                <th className={cls.sortable} onClick={() => handleSort('createdAt')}>{String(t('Дата'))} {renderSortIcon('createdAt')}</th>
                                <th className={cls.sortable} onClick={() => handleSort('operatorName')}>{String(t('Оператор'))} {renderSortIcon('operatorName')}</th>
                                <th className={cls.sortable} onClick={() => handleSort('projectId')}>{String(t('Проект'))} {renderSortIcon('projectId')}</th>
                                <th className={cls.sortable} onClick={() => handleSort('duration')}>{String(t('Длительность'))} {renderSortIcon('duration')}</th>
                                <th className={cls.sortable} onClick={() => handleSort('customer_sentiment')}>{String(t('Настроение'))} {renderSortIcon('customer_sentiment')}</th>
                                <th>{String(t('Скоринг'))}</th>
                                <th>{String(t('Метрики'))}</th>
                                <th className={cls.sortable} onClick={() => handleSort('status')}>{String(t('Статус'))} {renderSortIcon('status')}</th>
                                <th className={cls.tdActions}></th>
                            </tr>
                        </thead>
                        <tbody className={cls.TableBody}>
                            {rows.map(row => (
                                <CdrRow key={row.id} row={row} colSpan={COL_SPAN} />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !isLoading && (
                    <Card padding={'48'} max border={'partial'} variant={'glass'}>
                        <VStack max align={'center'} justify={'center'} gap={'16'}>
                            <HeadsetMicIcon sx={{ fontSize: 56, color: 'var(--icon-redesigned)', opacity: 0.4 }} />
                            <Text align={'center'} title={String(t('Данные не найдены'))} />
                            <Text align={'center'} text={String(t('Загрузите первый звонок для анализа'))} />
                            <Button
                                variant={'glass-action'}
                                addonLeft={<UploadFileIcon fontSize={'small'} />}
                                onClick={() => setUploadOpen(true)}
                            >
                                {String(t('Загрузить звонок'))}
                            </Button>
                        </VStack>
                    </Card>
                )
            )}

            {/* Skeletons */}
            {isLoading && (
                <VStack gap={'12'} max>
                    {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} variant={'rounded'} height={64} className={cls.skeleton} />
                    ))}
                </VStack>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <HStack gap={'4'} justify={'center'} wrap={'wrap'}>
                    <Button variant={'outline'} size={'s'} onClick={() => onChangePage(1)} disabled={page <= 1}>{'«'}</Button>
                    <Button variant={'outline'} size={'s'} onClick={() => onChangePage(page - 1)} disabled={page <= 1}>{'‹'}</Button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        let pageNum: number
                        if (totalPages <= 7) {
                            pageNum = i + 1
                        } else if (page <= 4) {
                            pageNum = i + 1
                        } else if (page >= totalPages - 3) {
                            pageNum = totalPages - 6 + i
                        } else {
                            pageNum = page - 3 + i
                        }
                        return (
                            <Button
                                key={pageNum}
                                variant={pageNum === page ? 'glass-action' : 'outline'}
                                size={'s'}
                                onClick={() => onChangePage(pageNum)}
                            >
                                {String(pageNum)}
                            </Button>
                        )
                    })}
                    <Button variant={'outline'} size={'s'} onClick={() => onChangePage(page + 1)} disabled={page >= totalPages}>{'›'}</Button>
                    <Button variant={'outline'} size={'s'} onClick={() => onChangePage(totalPages)} disabled={page >= totalPages}>{'»'}</Button>
                </HStack>
            )}


            {/* Upload modal */}
            <Modal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} lazy>
                <div className={cls.uploadModal}>
                    <button
                        type={'button'}
                        className={cls.uploadModalClose}
                        onClick={() => setUploadOpen(false)}
                        aria-label={'Close'}
                    >
                        {'✕'}
                    </button>
                    <VStack gap={'16'} max>
                        <Text title={String(t('Загрузить звонок'))} bold />
                        <OperatorUploadForm isOpen={uploadOpen} onClose={() => setUploadOpen(false)} />
                    </VStack>
                </div>
            </Modal>
        </VStack>
    )
})
