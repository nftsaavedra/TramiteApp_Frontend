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

// La interfaz define que el toolbar recibe la instancia de la tabla y una función para la acción de crear.
interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onCreate: () => void
}

export function DataTableToolbar<TData>({
  table,
  onCreate,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  // Formateamos las opciones del enum para que sean legibles en el filtro.
  // Ej: 'ORGANO_DE_LINEA' se convierte en 'Organo de linea'.
  const tipoOptions = tiposOficina.map((tipo) => ({
    label:
      tipo.replace(/_/g, ' ').charAt(0).toUpperCase() +
      tipo.replace(/_/g, ' ').slice(1).toLowerCase(),
    value: tipo,
  }))

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        {/* Input para filtrar por la columna 'nombre' */}
        <Input
          placeholder='Filtrar por nombre...'
          value={(table.getColumn('nombre')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('nombre')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {/* Filtro por facetas para la columna 'tipo' */}
        {table.getColumn('tipo') && (
          <DataTableFacetedFilter
            column={table.getColumn('tipo')}
            title='Tipo'
            options={tipoOptions}
          />
        )}
        {/* Botón para limpiar todos los filtros si hay alguno activo */}
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
        {/* Botón para disparar la acción de crear una nueva oficina */}
        <Button onClick={onCreate} size='sm' className='h-8'>
          <PlusCircledIcon className='mr-2 h-4 w-4' />
          Añadir Oficina
        </Button>
        {/* Componente para mostrar/ocultar columnas */}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
