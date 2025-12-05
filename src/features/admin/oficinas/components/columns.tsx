// En: src/features/admin/oficinas/components/columns.tsx

'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableRowActions } from './oficinas-row-actions'

// En: src/features/admin/oficinas/components/columns.tsx

// En: src/features/admin/oficinas/components/columns.tsx

// 1. Tipo actualizado para incluir la relación `parent` opcional
export type Oficina = {
  id: string
  nombre: string
  siglas: string
  tipo: string
  isActive: boolean
  parentId: string | null
  parent: {
    siglas: string
  } | null
}

export const columns: ColumnDef<Oficina>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Seleccionar todo'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Seleccionar fila'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
    cell: ({ row }) => (
      <div className='truncate font-medium'>{row.getValue('nombre')}</div>
    ),
  },
  {
    accessorKey: 'siglas',
    header: 'Siglas',
  },
  // --- INICIO: NUEVA COLUMNA PARA JERARQUÍA ---
  {
    accessorKey: 'parent',
    header: 'Depende de',
    cell: ({ row }) => {
      const parent = row.original.parent
      return parent ? (
        <span className='font-medium'>{parent.siglas}</span>
      ) : (
        <span className='text-muted-foreground text-xs'>—</span>
      )
    },
  },
  // --- FIN: NUEVA COLUMNA PARA JERARQUÍA ---
  {
    accessorKey: 'tipo',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tipo' />
    ),
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs font-medium'>
        {row.getValue('tipo')}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const { onEdit, onDelete } = table.options.meta as {
        onEdit: (oficina: Oficina) => void
        onDelete: (oficina: Oficina) => void
      }
      return (
        <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
      )
    },
  },
]
