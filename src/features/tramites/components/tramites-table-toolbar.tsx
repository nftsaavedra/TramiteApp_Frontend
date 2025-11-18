'use client'

import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import { estados, prioridades } from '../data/data'

// Principio OCP: Definimos una interfaz para que las opciones puedan venir de cualquier fuente
export interface FilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface TramitesTableToolbarProps<TData> {
  table: Table<TData>
  // Inyección de dependencias: Pasamos los datos desde el padre
  oficinasOptions?: FilterOption[]
  tiposDocumentoOptions?: FilterOption[]
}

export function TramitesTableToolbar<TData>({
  table,
  oficinasOptions = [],
  tiposDocumentoOptions = [],
}: TramitesTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex flex-wrap items-center justify-between gap-2'>
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        <Input
          placeholder='Buscar por asunto...'
          value={(table.getColumn('asunto')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('asunto')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />

        {/* Filtros Estáticos (Enums del Frontend) */}
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

        {/* Filtros Dinámicos (Datos del Backend) */}
        {table.getColumn('oficinaRemitenteId') &&
          oficinasOptions.length > 0 && (
            <DataTableFacetedFilter
              column={table.getColumn('oficinaRemitenteId')}
              title='Oficina'
              options={oficinasOptions}
            />
          )}

        {table.getColumn('tipoDocumentoId') &&
          tiposDocumentoOptions.length > 0 && (
            <DataTableFacetedFilter
              column={table.getColumn('tipoDocumentoId')}
              title='Tipo Doc.'
              options={tiposDocumentoOptions}
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
