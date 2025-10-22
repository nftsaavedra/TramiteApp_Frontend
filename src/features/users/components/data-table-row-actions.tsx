// En: src/features/users/components/data-table-row-actions.tsx

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
import { type User } from './users-provider'

// En: src/features/users/components/data-table-row-actions.tsx

// La interfaz ahora define que el componente recibe las funciones como props
interface DataTableRowActionsProps {
  row: Row<User>
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function DataTableRowActions({
  row,
  onEdit,
  onDelete,
}: DataTableRowActionsProps) {
  const user = row.original

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
        <DropdownMenuItem onClick={() => onEdit(user)}>Editar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete(user)}
          className='text-destructive focus:bg-destructive/10 focus:text-destructive'
        >
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
