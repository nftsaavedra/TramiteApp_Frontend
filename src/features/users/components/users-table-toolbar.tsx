'use client'

import { useState, useEffect } from 'react'
import { type Table } from '@tanstack/react-table'
import { X, Search, Loader2, Shield, Activity } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
  const [isSearching, setIsSearching] = useState(false)
  
  // Debounce del valor de búsqueda: solo actualiza después de 500ms
  const debouncedSearchValue = useDebounce(searchValue, 500)
  
  // Sincronizar filtro global cuando cambia el valor debounced
  useEffect(() => {
    if (debouncedSearchValue !== globalFilter) {
      setIsSearching(true)
      onGlobalFilterChange(debouncedSearchValue)
      setTimeout(() => setIsSearching(false), 300)
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
          <div className='relative flex items-center w-full sm:w-auto'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Search 
                    className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' 
                    aria-hidden='true'
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Buscar por nombre, email o rol</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              placeholder='Buscar usuarios...'
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value)
                // No actualizar inmediatamente - usar debounce
              }}
              aria-label='Buscar usuarios por nombre, email o rol'
              className='h-8 w-full pl-8 pr-8 sm:w-[250px] lg:w-[300px]'
            />
            {isSearching && (
              <Loader2 className='absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground' aria-hidden='true' />
            )}
            {searchValue && !isSearching && (
              <Button
                variant='ghost'
                size='icon'
                className='absolute right-0 top-0 h-8 w-8 hover:bg-transparent'
                onClick={() => {
                  setSearchValue('')
                  onGlobalFilterChange('')
                }}
                aria-label='Limpiar búsqueda'
                type='button'
              >
                <X className='h-4 w-4 text-muted-foreground' />
              </Button>
            )}
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
