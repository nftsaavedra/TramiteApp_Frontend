// En: src/features/admin/oficinas/components/columns.tsx

'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableRowActions } from './oficinas-row-actions'

// En: src/features/admin/oficinas/components/columns.tsx

export type Oficina = {
  id: string
  nombre: string
  siglas: string
  tipo: string
  isActive: boolean
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
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>
            {row.getValue('nombre')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'siglas',
    header: 'Siglas',
  },
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
      // Se extraen las funciones de la metadata de la tabla
      const { onEdit, onDelete } = table.options.meta as {
        onEdit: (oficina: Oficina) => void
        onDelete: (oficina: Oficina) => void
      }
      // Se pasan las funciones al componente de acciones
      return (
        <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
      )
    },
  },
]
