// En: src/features/admin/oficinas/components/oficinas-table-toolbar.tsx

'use client'

import { Cross2Icon, PlusCircledIcon } from '@radix-ui/react-icons'
// Añadir icono
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import { tiposOficina } from '../data/schema'

// En: src/features/admin/oficinas/components/oficinas-table-toolbar.tsx

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onCreate: () => void // <-- Prop para manejar la creación
}

export function DataTableToolbar<TData>({
  table,
  onCreate, // <-- Recibimos la función
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const tipoOptions = tiposOficina.map((tipo) => ({
    label:
      tipo.replace(/_/g, ' ').charAt(0).toUpperCase() +
      tipo.replace(/_/g, ' ').slice(1).toLowerCase(),
    value: tipo,
  }))

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        {/* ...Input y Filtros sin cambios... */}
      </div>
      <div className='flex items-center space-x-2'>
        <Button onClick={onCreate} size='sm' className='h-8'>
          {' '}
          {/* <-- Botón de creación */}
          <PlusCircledIcon className='mr-2 h-4 w-4' />
          Añadir Oficina
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
