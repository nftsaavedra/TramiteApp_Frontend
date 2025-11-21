'use client'

import { useState, useEffect } from 'react'
import { Table } from '@tanstack/react-table'
import { X, Search } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateRangeFilter } from '@/components/data-table/date-range-filter'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
// Asegúrate de tener este componente
import { estados, prioridades } from '../data/data'

export interface FilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

interface TramitesTableToolbarProps<TData> {
  table: Table<TData>
  oficinasOptions?: FilterOption[]
  tiposDocumentoOptions?: FilterOption[]

  // --- PROPS CRÍTICAS PARA BÚSQUEDA Y FECHAS ---
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
  onDateFilterChange: (
    type: 'documento' | 'registro',
    range: DateRange | undefined
  ) => void
  activeDateRange?: DateRange
  activeDateType?: 'documento' | 'registro'
}

export function TramitesTableToolbar<TData>({
  table,
  oficinasOptions = [],
  tiposDocumentoOptions = [],
  // Recibimos las props del padre
  globalFilter,
  onGlobalFilterChange,
  onDateFilterChange,
  activeDateRange,
  activeDateType = 'documento',
}: TramitesTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    !!globalFilter ||
    !!activeDateRange

  // Estado local para input (evita lentitud al escribir)
  const [searchValue, setSearchValue] = useState(globalFilter)

  useEffect(() => {
    setSearchValue(globalFilter)
  }, [globalFilter])

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-1 flex-wrap items-center gap-2'>
          {/* 1. INPUT DE BÚSQUEDA GLOBAL (Conectado a 'q') */}
          <div className='relative'>
            <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
            <Input
              placeholder='Buscar (Asunto, Oficina, Doc...)'
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value)
                onGlobalFilterChange(event.target.value)
              }}
              className='h-8 w-[250px] pl-8 lg:w-[350px]'
            />
          </div>

          {/* 2. FILTRO DE FECHAS (Conectado a params de fecha) */}
          <DateRangeFilter
            type={activeDateType}
            onTypeChange={(newType) =>
              onDateFilterChange(newType, activeDateRange)
            }
            date={activeDateRange}
            onDateChange={(newRange) =>
              onDateFilterChange(activeDateType, newRange)
            }
          />

          {/* 3. FILTROS DE COLUMNA (Conectados a accessorKey/id) */}
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
              onClick={() => {
                table.resetColumnFilters()
                onGlobalFilterChange('') // Limpia 'q'
                onDateFilterChange('documento', undefined) // Limpia fechas
                setSearchValue('')
              }}
              className='h-8 px-2 lg:px-3'
            >
              Limpiar filtros
              <X className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
