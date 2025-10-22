// En: src/features/users/components/users-columns.tsx

'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
// Importa el tipo correcto desde el Provider
import { DataTableRowActions } from './data-table-row-actions'
import { type User } from './users-provider'

// En: src/features/users/components/users-columns.tsx

/**
 * Factory function para crear las columnas de la tabla de usuarios.
 * Este patrón permite inyectar las funciones de onEdit y onDelete
 * de una manera limpia y desacoplada, siguiendo los principios SOLID.
 */
export const createUsersColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}): ColumnDef<User>[] => [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[200px] truncate font-medium'>
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Correo Electrónico' />
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rol' />
    ),
    cell: ({ row }) => (
      <Badge variant='outline' className='capitalize'>
        {String(row.getValue('role')).toLowerCase()}
      </Badge>
    ),
  },
  {
    accessorKey: 'oficina',
    header: 'Oficina',
    cell: ({ row }) => {
      const oficina = row.original.oficina
      return oficina ? (
        <span className='font-medium'>{oficina.siglas}</span>
      ) : (
        <span className='text-muted-foreground text-xs'>—</span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      // Pasa las funciones onEdit y onDelete al componente de acciones
      <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
]
