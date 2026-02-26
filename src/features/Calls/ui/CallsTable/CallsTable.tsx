import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { classNames } from '@/shared/lib/classNames/classNames'
import { HStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { Button } from '@/shared/ui/redesigned/Button'
import { Report } from '@/entities/Report'
import { ReportExpandedPanel } from '@/entities/Report/ui/ReportExpandedPanel/ReportExpandedPanel'
import { useGetReportDialogs, useCreateCallAnalytics } from '@/entities/Report/api/reportApi'
import { formatTime } from '@/shared/lib/functions/formatTime'
import { formatCurrency } from '@/shared/lib/functions/formatCurrency'
import { useSelector } from 'react-redux'
import { getUserAuthData, UserCurrencyValues } from '@/entities/User'
import {
    ChevronDown, ChevronUp, Star, CheckCircle, AlertCircle,
    Phone, Globe, Monitor, Mic
} from 'lucide-react'
import cls from './CallsTable.module.scss'

// ── Source config ─────────────────────────────────────────────────────────────
const SOURCE_CONFIG: Record<string, { icon: React.ReactNode; labelKey: string }> = {
    call: { icon: <Phone size={14} />, labelKey: 'Звонок' },
    widget: { icon: <Globe size={14} />, labelKey: 'Виджет' },
    playground: { icon: <Monitor size={14} />, labelKey: 'Playground' },
    'external-api': { icon: <Mic size={14} />, labelKey: 'Аналитика (API)' },
    'external-front': { icon: <Mic size={14} />, labelKey: 'Аналитика' },
}

// ── Row ───────────────────────────────────────────────────────────────────────
interface CallsTableRowProps {
    report: Report
}

const CallsTableRow = memo(({ report }: CallsTableRowProps) => {
    const { t } = useTranslation('reports')
    const authData = useSelector(getUserAuthData)
    const userCurrency = UserCurrencyValues.USD || authData?.currency
    const [isExpanded, setIsExpanded] = useState(false)

    const { data: dialogs, isLoading: isDialogLoading, isError: isDialogError } =
        useGetReportDialogs(report.channelId, {
            skip: !isExpanded,
            refetchOnFocus: false,
            refetchOnReconnect: false
        })

    const [createCallAnalytics, { isLoading: isAnalyticsLoading }] = useCreateCallAnalytics()

    const onToggle = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        setIsExpanded(prev => !prev)
    }, [])

    const onGetAnalytics = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation()
        try { await createCallAnalytics(report.channelId).unwrap() }
        catch (err) { console.error(err) }
    }, [createCallAnalytics, report.channelId])

    const formattedDate = report.createdAt
        ? new Intl.DateTimeFormat(undefined, {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: false
        }).format(new Date(report.createdAt))
        : ''

    const source = report.source ?? ''
    const sourceCfg = SOURCE_CONFIG[source]
    const duration = report.duration ? formatTime(report.duration, t) : '—'
    const csat = report.analytics?.csat
    const scenarioSuccess = report.analytics?.metrics?.scenario_analysis?.success

    return (
        <>
            <tr
                className={classNames(cls.Row, { [cls.expanded]: isExpanded })}
                onClick={onToggle}
                id={`calls-row-${report.id}`}
            >
                <td data-label={String(t('Дата'))}>
                    <Text text={formattedDate} />
                </td>

                <td data-label={String(t('Ассистент'))}>
                    {report.assistantName ? <Text text={report.assistantName} /> : '—'}
                </td>

                <td data-label={String(t('Звонивший'))}>
                    {report.callerId ? <Text text={report.callerId} /> : '—'}
                </td>

                <td data-label={String(t('Источник'))}>
                    {sourceCfg ? (
                        <span
                            className={cls.sourceBadge}
                            data-source={source}
                            data-tooltip={String(t(sourceCfg.labelKey))}
                        >
                            {sourceCfg.icon}
                            <span className={cls.badgeText}>{String(t(sourceCfg.labelKey))}</span>
                        </span>
                    ) : '—'}
                </td>

                <td data-label={String(t('Длительность'))}>
                    <Text text={String(duration)} />
                </td>

                <td data-label={String(t('Стоимость'))}>
                    {report.cost
                        ? <Text text={formatCurrency(report.cost, userCurrency, 4)} bold />
                        : '—'}
                </td>

                <td data-label="CSAT" className={cls.csatCell}>
                    {csat != null ? (
                        <HStack gap="4" align="center" className={cls.csatValue}>
                            <Star size={14} className={cls.csatStar} />
                            <Text text={String(csat)} bold />
                        </HStack>
                    ) : '—'}
                </td>

                <td data-label={String(t('Настроение'))}>
                    {report.analytics?.sentiment ? (
                        <span
                            className={cls.sentimentBadge}
                            data-sentiment={report.analytics.sentiment.toLowerCase()}
                        >
                            {String(t(report.analytics.sentiment))}
                        </span>
                    ) : '—'}
                </td>

                <td data-label={String(t('Результат'))}>
                    {scenarioSuccess === true && (
                        <span className={cls.successText} data-tooltip={String(t('Успех'))}>
                            <CheckCircle size={16} />
                            <span className={cls.badgeText}>{String(t('Успех'))}</span>
                        </span>
                    )}
                    {scenarioSuccess === false && (
                        <span className={cls.escalationText} data-tooltip={String(t('Эскалация'))}>
                            <AlertCircle size={16} />
                            <span className={cls.badgeText}>{String(t('Эскалация'))}</span>
                        </span>
                    )}
                    {scenarioSuccess == null && '—'}
                </td>

                <td onClick={e => e.stopPropagation()}>
                    <HStack justify="end">
                        <Button variant="clear" onClick={onToggle} id={`calls-expand-${report.id}`}>
                            {isExpanded
                                ? <ChevronUp size={20} className={cls.expandIcon} />
                                : <ChevronDown size={20} className={cls.expandIcon} />}
                        </Button>
                    </HStack>
                </td>
            </tr>

            {isExpanded && (
                <tr className={cls.DetailRow}>
                    <td colSpan={10}>
                        <ReportExpandedPanel
                            report={report}
                            dialogs={dialogs}
                            isDialogLoading={isDialogLoading}
                            isDialogError={isDialogError}
                            mediaUrl={report.recordUrl}
                            onGetAnalytics={onGetAnalytics}
                            isAnalyticsLoading={isAnalyticsLoading}
                        />
                    </td>
                </tr>
            )}
        </>
    )
})

// ── CallsTable ────────────────────────────────────────────────────────────────
interface CallsTableProps {
    reports: Report[]
    sortField?: string
    sortOrder?: 'ASC' | 'DESC'
    onChangeSort: (field: string) => void
}

export const CallsTable = memo(({ reports, sortField, sortOrder, onChangeSort }: CallsTableProps) => {
    const { t } = useTranslation('reports')

    const renderSortIcon = (field: string) => {
        if (sortField !== field) return null
        return sortOrder === 'ASC'
            ? <ChevronUp size={14} className={cls.sortIcon} />
            : <ChevronDown size={14} className={cls.sortIcon} />
    }

    return (
        <div className={cls.TableWrapper}>
            <table className={cls.Table}>
                <thead className={cls.TableHeader}>
                    <tr>
                        <th className={cls.sortable} onClick={() => onChangeSort('createdAt')}>
                            <HStack gap="4">{String(t('Дата'))} {renderSortIcon('createdAt')}</HStack>
                        </th>
                        <th className={cls.sortable} onClick={() => onChangeSort('assistantName')}>
                            <HStack gap="4">{String(t('Ассистент'))} {renderSortIcon('assistantName')}</HStack>
                        </th>
                        <th className={cls.sortable} onClick={() => onChangeSort('callerId')}>
                            <HStack gap="4">{String(t('Звонивший'))} {renderSortIcon('callerId')}</HStack>
                        </th>
                        <th className={cls.sortable} onClick={() => onChangeSort('source')}>
                            <HStack gap="4">{String(t('Источник'))} {renderSortIcon('source')}</HStack>
                        </th>
                        <th className={cls.sortable} onClick={() => onChangeSort('duration')}>
                            <HStack gap="4">{String(t('Длительность'))} {renderSortIcon('duration')}</HStack>
                        </th>
                        <th className={cls.sortable} onClick={() => onChangeSort('cost')}>
                            <HStack gap="4">{String(t('Стоимость'))} {renderSortIcon('cost')}</HStack>
                        </th>
                        <th className={cls.sortable} onClick={() => onChangeSort('csat')}>
                            <HStack gap="4">CSAT {renderSortIcon('csat')}</HStack>
                        </th>
                        <th className={cls.sortable} onClick={() => onChangeSort('sentiment')}>
                            <HStack gap="4">{String(t('Настроение'))} {renderSortIcon('sentiment')}</HStack>
                        </th>
                        <th className={cls.sortable} onClick={() => onChangeSort('scenarioSuccess')}>
                            <HStack gap="4">{String(t('Результат'))} {renderSortIcon('scenarioSuccess')}</HStack>
                        </th>
                        <th />
                    </tr>
                </thead>
                <tbody className={cls.TableBody}>
                    {reports.map(report => (
                        <CallsTableRow key={report.id} report={report} />
                    ))}
                </tbody>
            </table>
        </div>
    )
})
