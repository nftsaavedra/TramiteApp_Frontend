// En: src/features/admin/oficinas/components/oficinas-table-toolbar.tsx

'use client'

import { Cross2Icon, PlusCircledIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import { tiposOficina } from '../data/schema'

// En: src/features/admin/oficinas/components/oficinas-table-toolbar.tsx

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onCreate: () => void
}

export function DataTableToolbar<TData>({
  table,
  onCreate,
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
        <Input
          placeholder='Filtrar por nombre...'
          value={(table.getColumn('nombre')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nombre')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {/* --- INICIO: NUEVO FILTRO POR SIGLAS --- */}
        <Input
          placeholder='Filtrar por siglas...'
          value={(table.getColumn('siglas')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('siglas')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px]'
        />
        {/* --- FIN: NUEVO FILTRO POR SIGLAS --- */}
        {table.getColumn('tipo') && (
          <DataTableFacetedFilter
            column={table.getColumn('tipo')}
            title='Tipo'
            options={tipoOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Limpiar
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>

      <div className='flex items-center space-x-2'>
        <Button onClick={onCreate} size='sm' className='h-8'>
          <PlusCircledIcon className='mr-2 h-4 w-4' />
          Añadir Oficina
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
