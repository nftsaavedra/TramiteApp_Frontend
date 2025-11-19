'use client'

import { useState, useEffect } from 'react'
import { Table } from '@tanstack/react-table'
import { X, Search, Shield, Activity } from 'lucide-react'
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
  const [searchValue, setSearchValue] = useState(globalFilter)

  // Sincronizar estado local si la URL cambia externamente
  useEffect(() => {
    setSearchValue(globalFilter)
  }, [globalFilter])

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-1 flex-wrap items-center gap-2'>
          {/* 1. Búsqueda Inteligente */}
          <div className='relative'>
            <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
            <Input
              placeholder='Buscar usuarios...'
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value)
                onGlobalFilterChange(event.target.value)
              }}
              className='h-8 w-[250px] pl-8 lg:w-[300px]'
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
              }}
              className='h-8 px-2 lg:px-3'
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
