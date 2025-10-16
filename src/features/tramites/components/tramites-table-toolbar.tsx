// En: src/features/tramites/components/tramites-table-toolbar.tsx

'use client'

import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import { estados, prioridades } from '../data/data'

// En: src/features/tramites/components/tramites-table-toolbar.tsx

interface TramitesTableToolbarProps<TData> {
  table: Table<TData>
}

export function TramitesTableToolbar<TData>({
  table,
}: TramitesTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Buscar por asunto...'
          value={(table.getColumn('asunto')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('asunto')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {table.getColumn('estado') && (
          <DataTableFacetedFilter
            column={table.getColumn('estado')}
            title='Estado'
            options={estados}
          />
        )}
        {table.getColumn('prioridad') && (
          <DataTableFacetedFilter
            column={table.getColumn('prioridad')}
            title='Prioridad'
            options={prioridades}
          />
        )}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Limpiar filtros
            <X className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
