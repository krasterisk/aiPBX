import React, { Fragment } from 'react'
import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Table.module.scss'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getExpandedRowModel,
  Row,
  SortingState
} from '@tanstack/react-table'
import { VStack, HStack } from '@/shared/ui/redesigned/Stack'

export type TableRowVariant = 'clear' | 'outline' | 'filled' | 'glass'

interface TableProps<T extends object> {
  data: T[] | undefined
  columns: any[]
  className?: string
  onEdit?: (id: string) => void
  onRowClick?: (row: Row<T>) => void
  renderExpandedRow?: (row: Row<T>) => React.ReactNode
  sorting?: SortingState
  setSorting?: (updater: SortingState | ((old: SortingState) => SortingState)) => void
  /** Row style variant. Default: 'glass' */
  rowVariant?: TableRowVariant
}

export const Table = <T extends object>(props: TableProps<T>) => {
  const {
    data = [],
    columns,
    className,
    onEdit,
    onRowClick,
    renderExpandedRow,
    sorting,
    setSorting,
    rowVariant = 'glass'
  } = props

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => !!renderExpandedRow
  })

  const handleOnEditClick = (id: string) => {
    onEdit?.(id)
  }

  const hasFooter = table.getFooterGroups().some((footerGroup) =>
    footerGroup.headers.some((header) => !header.isPlaceholder && header.column.columnDef.footer)
  )

  return (
    <VStack max className={classNames(cls.TableWrapper, {}, [className])}>
      <table className={cls.Table}>
        <thead className={cls.TableHeader}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={classNames('', { [cls.sortable]: header.column.getCanSort() })}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <HStack gap="4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <span> ↑</span>,
                      desc: <span> ↓</span>
                    }[header.column.getIsSorted() as string] ?? null}
                  </HStack>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={cls.TableBody}>
          {table.getRowModel().rows.map((row) => (
            <Fragment key={row.id}>
              <tr
                className={classNames(
                  cls.TableItem,
                  { [cls.expanded]: row.getIsExpanded() },
                  [cls[`row_${rowVariant}`]]
                )}
                onClick={() => {
                  if (onRowClick) onRowClick(row)
                  else if (renderExpandedRow) row.toggleExpanded()
                }}
                onDoubleClick={() => {
                  const id = row.getValue('id')
                  if (typeof id === 'string') handleOnEditClick(id)
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    data-label={
                      typeof cell.column.columnDef.header === 'string'
                        ? cell.column.columnDef.header
                        : ''
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              {row.getIsExpanded() && renderExpandedRow && (
                <tr className={cls.DialogRow}>
                  <td colSpan={row.getVisibleCells().length}>
                    {renderExpandedRow(row)}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
        {hasFooter && (
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.footer, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        )}
      </table>
    </VStack>
  )
}
