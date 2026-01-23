import { classNames } from '@/shared/lib/classNames/classNames'
import cls from './Table.module.scss'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

interface TableProps<T extends object> {
  data: T[] | undefined
  columns: any[]
  className?: string
  onEdit?: (id: string) => void
}

export const Table = <T extends object>(props: TableProps<T>) => {
  const {
    data = undefined!,
    columns,
    className,
    onEdit
  } = props

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  const handleOnEditClick = (id: string) => {
    onEdit?.(id)
  }

  const hasFooter = table.getFooterGroups().some(footerGroup =>
    footerGroup.headers.some(header => !header.isPlaceholder && header.column.columnDef.footer)
  )

  return (
    <div className={classNames(cls.table, {}, [className])}>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              onDoubleClick={() => { handleOnEditClick(row.getValue('id')) }}
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  data-label={typeof cell.column.columnDef.header === 'string' ? cell.column.columnDef.header : ''}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {hasFooter && (
          <tfoot>
            {table.getFooterGroups().map(footerGroup => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        )}
      </table>
    </div>
  )
}
