// En: src/features/tramites/components/tramites-table.tsx

'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  PaginationState,
} from '@tanstack/react-table'
import api from '@/lib/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table/pagination'
import { type Tramite } from './columns'
import { TramitesTableToolbar } from './tramites-table-toolbar'

// En: src/features/tramites/components/tramites-table.tsx

// El tipo de respuesta paginada que esperamos del backend
type TramitesApiResponse = {
  data: Tramite[]
  meta: {
    total: number
    page: number
    limit: number
    lastPage: number
  }
}

// La función de fetching ahora acepta TODOS los estados de la tabla
const fetchTramites = async (
  pagination: PaginationState,
  filters: ColumnFiltersState,
  sorting: SortingState
): Promise<TramitesApiResponse> => {
  const params = new URLSearchParams()

  // Mapear paginación
  params.append('page', (pagination.pageIndex + 1).toString())
  params.append('limit', pagination.pageSize.toString())

  // Mapear filtros
  filters.forEach((filter) => {
    if (filter.id === 'asunto' && filter.value) {
      params.append('q', filter.value as string)
    } else if (filter.value && (filter.value as string[]).length > 0) {
      params.append(filter.id, (filter.value as string[]).join(','))
    }
  })

  // Mapear ordenamiento
  if (sorting.length > 0) {
    params.append(
      'sortBy',
      `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}`
    )
  }

  const { data } = await api.get('/tramites', { params })
  return data
}

interface DataTableProps {
  columns: ColumnDef<Tramite>[]
}

export function TramitesDataTable({ columns }: DataTableProps) {
  // Estados para todos los aspectos de la tabla controlados por el servidor
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'fechaIngreso', desc: true },
  ])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // useQuery ahora depende de todos los estados de la tabla
  const {
    data: response,
    isLoading,
    isPlaceholderData,
    error,
  } = useQuery({
    queryKey: ['tramites', pagination, columnFilters, sorting],
    queryFn: () => fetchTramites(pagination, columnFilters, sorting),
    placeholderData: (previousData) => previousData, // Mantiene datos antiguos visibles mientras se cargan los nuevos
  })

  // La paginación por defecto si no hay respuesta
  const defaultPagination: PaginationState = {
    pageIndex: 0,
    pageSize: 10,
  }

  const table = useReactTable({
    data: response?.data ?? [],
    columns,
    // La tabla no necesita saber cómo filtrar o ordenar, solo mostrar los datos
    getCoreRowModel: getCoreRowModel(),
    // La paginación es manual y el conteo de páginas viene del servidor
    manualPagination: true,
    pageCount: response?.meta.lastPage ?? -1,
    // Conectamos los estados y sus actualizadores
    state: {
      sorting,
      columnFilters,
      pagination: response?.meta
        ? {
            pageIndex: response.meta.page - 1,
            pageSize: response.meta.limit,
          }
        : defaultPagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  })

  if (isLoading && !response) return <p>Cargando trámites...</p>
  if (error) return <p>Error al cargar los trámites.</p>

  return (
    <div className='space-y-4'>
      <TramitesTableToolbar table={table} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Delegamos la paginación al componente genérico */}
      <DataTablePagination table={table} />
    </div>
  )
}
