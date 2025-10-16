// En: src/features/admin/oficinas/components/oficinas-row-actions.tsx

'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Oficina } from './columns'

// En: src/features/admin/oficinas/components/oficinas-row-actions.tsx

interface DataTableRowActionsProps<TData extends Oficina> {
  row: Row<TData>
  onEdit: (data: TData) => void // <-- Prop para editar
  onDelete: (data: TData) => void // <-- Prop para eliminar
}

export function DataTableRowActions<TData extends Oficina>({
  row,
  onEdit,
  onDelete,
}: DataTableRowActionsProps<TData>) {
  const oficina = row.original

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={() => onEdit(oficina)}>
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(oficina)}
          className='text-red-600'
        >
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
