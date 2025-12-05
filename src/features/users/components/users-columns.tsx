// En: src/features/users/components/users-columns.tsx

'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { type User } from './users-provider'

// En: src/features/users/components/users-columns.tsx

// En: src/features/users/components/users-columns.tsx

// En: src/features/users/components/users-columns.tsx

// En: src/features/users/components/users-columns.tsx

// Mapa de etiquetas para roles (Mejora UX: evita mostrar 'MESA_PARTES' crudo)
const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  USER: 'Usuario',
  RECEPCIONISTA: 'Recepcionista',
  ANALISTA: 'Analista',
  ASESORIA: 'Asesoría',
  MESA_PARTES: 'Mesa de Partes',
}

/**
 * Factory function para crear las columnas de la tabla de usuarios.
 * Incluye la columna 'isActive' necesaria para el filtrado avanzado.
 */
export const createUsersColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}): ColumnDef<User>[] => [
  // 1. Columna de Selección
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

  // 2. Columna Nombre
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
    cell: ({ row }) => (
      <div className='truncate font-medium'>{row.getValue('name')}</div>
    ),
    enableHiding: false, // Generalmente no queremos ocultar el nombre
  },

  // 3. Columna Email
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Correo Electrónico' />
    ),
    cell: ({ row }) => <div className='w-[180px]'>{row.getValue('email')}</div>,
  },

  // 4. Columna Rol (Con mapeo visual)
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rol' />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      return (
        <div className='flex w-[120px] items-center'>
          <Badge variant='outline' className='capitalize'>
            {roleLabels[role] || role}
          </Badge>
        </div>
      )
    },
    filterFn: 'arrIncludesSome', // Permite filtrado múltiple del Toolbar
  },

  // 5. Columna Oficina
  {
    id: 'oficina', // Usamos ID porque accedemos a un objeto anidado manualmente
    accessorFn: (row) => row.oficina?.nombre || '', // Helper para ordenamiento básico
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Oficina' />
    ),
    cell: ({ row }) => {
      const oficina = row.original.oficina
      return oficina ? (
        <span className='block truncate font-medium' title={oficina.nombre}>
          {oficina.siglas}
        </span>
      ) : (
        <span className='text-muted-foreground text-xs'>—</span>
      )
    },
  },

  // 6. Columna Estado (isActive) - CRÍTICO PARA EL FILTRO
  {
    accessorKey: 'isActive', // Debe coincidir con el ID del Toolbar
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean

      return (
        <Badge
          variant={isActive ? 'default' : 'secondary'}
          className={!isActive ? 'text-muted-foreground' : ''}
        >
          {isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    // 'equals' es necesario para booleanos o strings exactos en TanStack Table
    filterFn: 'equals',
  },

  // 7. Acciones
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions row={row} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
]
