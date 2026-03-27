// En: src/features/admin/oficinas/components/oficinas-table-toolbar.tsx

'use client'

import { useState, useEffect } from 'react'
import { Cross2Icon, PlusCircledIcon } from '@radix-ui/react-icons'
import { Search, Loader2, X } from 'lucide-react'
import { type Table } from '@tanstack/react-table'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import { tiposOficina } from '../data/schema'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
  
  // Estado local para búsqueda por nombre (con debounce)
  const [nombreFilter, setNombreFilter] = useState(
    (table.getColumn('nombre')?.getFilterValue() as string) ?? ''
  )
  const [isSearchingNombre, setIsSearchingNombre] = useState(false)
  const debouncedNombreFilter = useDebounce(nombreFilter, 500)
  
  // Estado local para búsqueda por siglas (con debounce)
  const [siglasFilter, setSiglasFilter] = useState(
    (table.getColumn('siglas')?.getFilterValue() as string) ?? ''
  )
  const [isSearchingSiglas, setIsSearchingSiglas] = useState(false)
  const debouncedSiglasFilter = useDebounce(siglasFilter, 500)
  
  // Sincronizar filtros después del debounce
  useEffect(() => {
    setIsSearchingNombre(true)
    table.getColumn('nombre')?.setFilterValue(debouncedNombreFilter)
    setTimeout(() => setIsSearchingNombre(false), 300)
  }, [debouncedNombreFilter])
  
  useEffect(() => {
    setIsSearchingSiglas(true)
    table.getColumn('siglas')?.setFilterValue(debouncedSiglasFilter)
    setTimeout(() => setIsSearchingSiglas(false), 300)
  }, [debouncedSiglasFilter])
  
  // Sincronizar estados locales si los filtros cambian externamente
  useEffect(() => {
    const currentNombre = (table.getColumn('nombre')?.getFilterValue() as string) ?? ''
    if (currentNombre !== nombreFilter) {
      setNombreFilter(currentNombre)
    }
  }, [table.getColumn('nombre')?.getFilterValue(), nombreFilter])
  
  useEffect(() => {
    const currentSiglas = (table.getColumn('siglas')?.getFilterValue() as string) ?? ''
    if (currentSiglas !== siglasFilter) {
      setSiglasFilter(currentSiglas)
    }
  }, [table.getColumn('siglas')?.getFilterValue(), siglasFilter])

  const tipoOptions = tiposOficina.map((tipo) => ({
    label:
      tipo.replace(/_/g, ' ').charAt(0).toUpperCase() +
      tipo.replace(/_/g, ' ').slice(1).toLowerCase(),
    value: tipo,
  }))

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-1 flex-wrap items-center gap-2'>
          {/* 1. Búsqueda por nombre (con debounce) */}
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
                  <p>Filtrar oficinas por nombre</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              placeholder='Filtrar por nombre...'
              value={nombreFilter}
              onChange={(event) => setNombreFilter(event.target.value)}
              aria-label='Filtrar oficinas por nombre'
              className='h-8 w-full pl-8 pr-8 sm:w-[200px] lg:w-[250px]'
            />
            {isSearchingNombre && (
              <Loader2 className='absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground' aria-hidden='true' />
            )}
            {nombreFilter && !isSearchingNombre && (
              <Button
                variant='ghost'
                size='icon'
                className='absolute right-0 top-0 h-8 w-8 hover:bg-transparent'
                onClick={() => setNombreFilter('')}
                aria-label='Limpiar filtro por nombre'
                type='button'
              >
                <X className='h-4 w-4 text-muted-foreground' />
              </Button>
            )}
          </div>
          
          {/* 2. Búsqueda por siglas (con debounce) */}
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
                  <p>Filtrar por siglas de oficina</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Input
              placeholder='Filtrar por siglas...'
              value={siglasFilter}
              onChange={(event) => setSiglasFilter(event.target.value)}
              aria-label='Filtrar oficinas por siglas'
              className='h-8 w-full pl-8 pr-8 sm:w-[120px] lg:w-[150px]'
            />
            {isSearchingSiglas && (
              <Loader2 className='absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground' aria-hidden='true' />
            )}
            {siglasFilter && !isSearchingSiglas && (
              <Button
                variant='ghost'
                size='icon'
                className='absolute right-0 top-0 h-8 w-8 hover:bg-transparent'
                onClick={() => setSiglasFilter('')}
                aria-label='Limpiar filtro por siglas'
                type='button'
              >
                <X className='h-4 w-4 text-muted-foreground' />
              </Button>
            )}
          </div>
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
              onClick={() => {
                table.resetColumnFilters()
                setNombreFilter('')
                setSiglasFilter('')
              }}
              className='h-8 px-2 lg:px-3'
              aria-label='Limpiar todos los filtros'
            >
              Limpiar
              <Cross2Icon className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>

        <div className='flex flex-wrap items-center gap-2'>
          <Button onClick={onCreate} size='sm' className='h-8'>
            <PlusCircledIcon className='mr-2 h-4 w-4' />
            Añadir Oficina
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  )
}
