// En: src/features/admin/tipos-documento/components/columns.tsx

'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import { TipoDocumento } from '@/routes/_authenticated/admin/tipos-documento'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table/column-header'

// En: src/features/admin/tipos-documento/components/columns.tsx

// Usamos una factory function para inyectar las dependencias (onEdit, onDelete)
export const createTiposDocumentoColumns = ({
  onEdit,
  onDelete,
}: {
  onEdit: (item: TipoDocumento) => void
  onDelete: (item: TipoDocumento) => void
}): ColumnDef<TipoDocumento>[] => [
  {
    accessorKey: 'nombre',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
  },
  {
    accessorKey: 'descripcion',
    header: 'Descripción',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const item = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onEdit(item)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(item)}
              className='text-red-600'
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
