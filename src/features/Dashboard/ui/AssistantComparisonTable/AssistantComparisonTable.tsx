import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Chip,
    LinearProgress,
    Box
} from '@mui/material'
import { Card } from '@/shared/ui/redesigned/Card'
import { VStack } from '@/shared/ui/redesigned/Stack'
import { Text } from '@/shared/ui/redesigned/Text'
import { AssistantMetric } from '@/entities/Report'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './AssistantComparisonTable.module.scss'

interface AssistantComparisonTableProps {
    className?: string
    assistants?: AssistantMetric[]
    isLoading?: boolean
}

type Order = 'asc' | 'desc'
type OrderBy = 'assistantName' | 'callsCount' | 'avgCsat' | 'automationRate' | 'totalCost'

const getCSATColor = (csat: number): 'success' | 'primary' | 'error' => {
    if (csat >= 4.5) return 'success'
    if (csat >= 3.5) return 'primary'
    return 'error'
}

export const AssistantComparisonTable = memo((props: AssistantComparisonTableProps) => {
    const { className, assistants = [], isLoading } = props
    const { t } = useTranslation('reports')
    const [order, setOrder] = useState<Order>('desc')
    const [orderBy, setOrderBy] = useState<OrderBy>('callsCount')

    const handleSort = (property: OrderBy) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedAssistants = [...assistants].sort((a, b) => {
        let aValue: number | string = a[orderBy]
        let bValue: number | string = b[orderBy]

        if (orderBy === 'assistantName') {
            return order === 'asc'
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue))
        }

        return order === 'asc'
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue)
    })

    return (
        <Card
            max
            border="partial"
            padding="24"
            className={classNames(cls.AssistantComparisonTable, {}, [className])}
        >
            <VStack gap="16" max>
                <Text title={t('Assistant Comparison')} bold />
                <TableContainer className={cls.tableContainer}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'assistantName'}
                                        direction={orderBy === 'assistantName' ? order : 'asc'}
                                        onClick={() => handleSort('assistantName')}
                                    >
                                        {t('Assistant')}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="right">
                                    <TableSortLabel
                                        active={orderBy === 'callsCount'}
                                        direction={orderBy === 'callsCount' ? order : 'asc'}
                                        onClick={() => handleSort('callsCount')}
                                    >
                                        {t('Calls')}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="center">
                                    <TableSortLabel
                                        active={orderBy === 'avgCsat'}
                                        direction={orderBy === 'avgCsat' ? order : 'asc'}
                                        onClick={() => handleSort('avgCsat')}
                                    >
                                        {t('CSAT')}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'automationRate'}
                                        direction={orderBy === 'automationRate' ? order : 'asc'}
                                        onClick={() => handleSort('automationRate')}
                                    >
                                        {t('Automation')}
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell align="right">
                                    <TableSortLabel
                                        active={orderBy === 'totalCost'}
                                        direction={orderBy === 'totalCost' ? order : 'asc'}
                                        onClick={() => handleSort('totalCost')}
                                    >
                                        {t('Cost')}
                                    </TableSortLabel>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedAssistants.map((assistant) => (
                                <TableRow
                                    key={assistant.assistantId}
                                    className={cls.tableRow}
                                    hover
                                >
                                    <TableCell>{assistant.assistantName}</TableCell>
                                    <TableCell align="right">{assistant.callsCount}</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={assistant.avgCsat.toFixed(1)}
                                            color={getCSATColor(assistant.avgCsat)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ width: '100%', mr: 1 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={assistant.automationRate}
                                                color="success"
                                                sx={{ height: 6, borderRadius: 1 }}
                                            />
                                            <Text
                                                text={`${assistant.automationRate.toFixed(1)}%`}
                                                className={cls.progressLabel}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        ${assistant.totalCost.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </VStack>
        </Card>
    )
})
