'use client'

import { useRef, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { TableBody, TableRow, TableCell } from '@/components/ui/table'

/**
 * VirtualTableBody - Virtualización para tablas grandes (>100 rows)
 * 
 * Uso:
 * <Table>
 *   <TableHeader>...</TableHeader>
 *   <VirtualTableBody table={table} columns={columns} />
 * </Table>
 */
export function VirtualTableBody({ table, columns, rowHeight = 40, overscan = 5 }: {
  table: any
  columns: any[]
  rowHeight?: number
  overscan?: number
}) {
  const { rows } = table.getRowModel()
  const tableBodyRef = useRef<HTMLTableSectionElement>(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableBodyRef.current,
    estimateSize: () => rowHeight,
    overscan,
  })

  const virtualRows = virtualizer.getVirtualItems()

  const renderedCells = useMemo(() => {
    return virtualRows.map((virtualRow) => {
      const row = rows[virtualRow.index]
      
      return (
        <TableRow
          key={row.id}
          data-index={virtualRow.index}
          ref={(node) => virtualizer.measureElement(node)}
          className="absolute"
          style={{
            transform: `translateY(${virtualRow.start}px)`,
            height: `${virtualRow.size}px`,
          }}
        >
          {columns.map((column: any) => {
            const cell = row.getVisibleCells().find((c: any) => c.column.id === column.id)
            if (!cell) return null
            return <TableCell key={cell.id}>{cell.renderValue()}</TableCell>
          })}
        </TableRow>
      )
    })
  }, [virtualRows, rows, columns, virtualizer])

  return (
    <TableBody ref={tableBodyRef}>
      <tr style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <td style={{ padding: 0, margin: 0 }}>
          <div style={{ position: 'relative', width: '100%' }}>
            {renderedCells}
          </div>
        </td>
      </tr>
    </TableBody>
  )
}
