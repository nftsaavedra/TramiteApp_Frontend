'use client'

import { useState, useEffect } from 'react'
import { type Table } from '@tanstack/react-table'
import { X, Search, Shield, Activity } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'

// Opciones basadas en tu Schema Prisma (Role enum)
const rolesOptions = [
  { label: 'Administrador', value: 'ADMIN', icon: Shield },
  { label: 'Recepcionista', value: 'RECEPCIONISTA' },
  { label: 'Analista', value: 'ANALISTA' },
  { label: 'Asesoría', value: 'ASESORIA' },
]

const estadoOptions = [
  { label: 'Activo', value: 'true', icon: Activity },
  { label: 'Inactivo', value: 'false' },
]

interface UsersTableToolbarProps<TData> {
  table: Table<TData>
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
}

export function UsersTableToolbar<TData>({
  table,
  globalFilter,
  onGlobalFilterChange,
}: UsersTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || !!globalFilter
  
  // Estado local para input (evita lentitud al escribir)
  const [searchValue, setSearchValue] = useState(globalFilter)
  
  // Debounce del valor de búsqueda: solo actualiza después de 500ms
  const debouncedSearchValue = useDebounce(searchValue, 500)
  
  // Sincronizar filtro global cuando cambia el valor debounced
  useEffect(() => {
    if (debouncedSearchValue !== globalFilter) {
      onGlobalFilterChange(debouncedSearchValue)
    }
  }, [debouncedSearchValue, onGlobalFilterChange, globalFilter])
  
  // Sincronizar input local si el filtro global cambia externamente
  useEffect(() => {
    setSearchValue(globalFilter)
  }, [globalFilter])

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-1 flex-wrap items-center gap-2'>
          {/* 1. Búsqueda Inteligente (con debounce) */}
          <div className='relative w-full sm:w-auto'>
            <Search 
              className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' 
              aria-hidden='true'
            />
            <Input
              placeholder='Buscar usuarios...'
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value)
                // No actualizar inmediatamente - usar debounce
              }}
              aria-label='Buscar usuarios por nombre, email o rol'
              className='h-8 w-full pl-8 sm:w-[250px] lg:w-[300px]'
            />
          </div>

          {/* 2. Filtro de Roles */}
          {table.getColumn('role') && (
            <DataTableFacetedFilter
              column={table.getColumn('role')}
              title='Rol'
              options={rolesOptions}
            />
          )}

          {/* 3. Filtro de Estado (Activo/Inactivo) */}
          {/* Asumimos que la columna se llama 'isActive' para coincidir con el backend */}
          {table.getColumn('isActive') && (
            <DataTableFacetedFilter
              column={table.getColumn('isActive')}
              title='Estado'
              options={estadoOptions}
            />
          )}

          {isFiltered && (
            <Button
              variant='ghost'
              onClick={() => {
                table.resetColumnFilters()
                onGlobalFilterChange('')
                setSearchValue('')
              }}
              className='h-8 px-2 lg:px-3'
              aria-label='Limpiar todos los filtros'
            >
              Limpiar
              <X className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
