import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './WidgetList.module.scss'
import { memo, useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'
import { Button } from '@/shared/ui/redesigned/Button'
import { Input } from '@/shared/ui/redesigned/Input'
import { Table } from '@/shared/ui/redesigned/Table'
import { WidgetKey } from '@/entities/WidgetKeys'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CodeIcon from '@mui/icons-material/Code'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'

interface WidgetListProps {
    className?: string
    widgets: WidgetKey[]
    isLoading?: boolean
    onCreateClick: () => void
    onEditClick: (widget: WidgetKey) => void
    onGetCodeClick: (widget: WidgetKey) => void
    onDeleteClick: (widget: WidgetKey) => void
}

export const WidgetList = memo((props: WidgetListProps) => {
    const {
        className,
        widgets,
        isLoading,
        onCreateClick,
        onEditClick,
        onGetCodeClick,
        onDeleteClick
    } = props

    const { t } = useTranslation('assistants')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredWidgets = useMemo(() => {
        if (!searchQuery) return widgets
        const query = searchQuery.toLowerCase()
        return widgets.filter(widget =>
            widget.name.toLowerCase().includes(query) ||
            widget.assistant?.name.toLowerCase().includes(query)
        )
    }, [widgets, searchQuery])

    const columns = useMemo(() => [
        {
            header: t('Название виджета'),
            accessorKey: 'name',
            cell: (info: any) => <strong>{info.getValue()}</strong>
        },
        {
            header: t('Ассистент'),
            accessorKey: 'assistant',
            cell: (info: any) => {
                const assistant = info.getValue()
                return assistant ? `${assistant.name} (${assistant.voice})` : '-'
            }
        },
        {
            header: t('Домены'),
            accessorKey: 'allowedDomains',
            cell: (info: any) => {
                const domainsStr = info.getValue()
                try {
                    const domains = JSON.parse(domainsStr)
                    return (
                        <span className={cls.domainCount}>
                            {domains.length} {domains.length === 1 ? 'domain' : 'domains'}
                        </span>
                    )
                } catch {
                    return '-'
                }
            }
        },
        {
            header: t('Статус'),
            accessorKey: 'isActive',
            cell: (info: any) => {
                const isActive = info.getValue()
                return (
                    <span
                        className={classNames(cls.statusBadge, {}, [
                            isActive ? cls.statusActive : cls.statusInactive
                        ])}
                    >
                        {isActive ? (
                            <>
                                <CheckCircleIcon fontSize="small" />
                                {t('Активен')}
                            </>
                        ) : (
                            <>
                                <CancelIcon fontSize="small" />
                                {t('Неактивен')}
                            </>
                        )}
                    </span>
                )
            }
        },
        {
            header: t('Действия'),
            id: 'actions',
            cell: (info: any) => {
                const widget = info.row.original
                return (
                    <HStack gap="4" className={cls.actionButtons}>
                        <Button variant="clear" onClick={() => onGetCodeClick(widget)}>
                            <CodeIcon fontSize="small" />
                        </Button>
                        <Button variant="clear" onClick={() => onEditClick(widget)}>
                            <EditIcon fontSize="small" />
                        </Button>
                        <Button variant="clear" onClick={() => onDeleteClick(widget)} color="error">
                            <DeleteIcon fontSize="small" />
                        </Button>
                    </HStack>
                )
            }
        }
    ], [t, onEditClick, onGetCodeClick, onDeleteClick])

    if (!isLoading && widgets.length === 0) {
        return (
            <VStack className={classNames(cls.WidgetList, {}, [className])} max>
                <div className={cls.emptyState}>
                    <div className={cls.emptyIcon}>🎤</div>
                    <div className={cls.emptyTitle}>{t('Нет виджетов')}</div>
                    <div className={cls.emptyDescription}>
                        {t('Создайте ваш первый виджет')}
                    </div>
                    <Button onClick={onCreateClick}>
                        <AddIcon fontSize="small" />
                        {t('Создать виджет')}
                    </Button>
                </div>
            </VStack>
        )
    }

    return (
        <VStack className={classNames(cls.WidgetList, {}, [className])} gap="16" max>
            <div className={cls.header}>
                <h2 className={cls.title}>{t('Мои виджеты')}</h2>
                <HStack gap="8" className={cls.actions}>
                    <Input
                        className={cls.searchInput}
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder={t('Поиск') || ''}
                    />
                    <Button onClick={onCreateClick}>
                        <AddIcon fontSize="small" />
                        {t('Создать виджет')}
                    </Button>
                </HStack>
            </div>

            <Table
                data={filteredWidgets}
                columns={columns}
            />
        </VStack>
    )
})
