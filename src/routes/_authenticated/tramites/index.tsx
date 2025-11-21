import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  getCoreRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  PaginationState,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table'
import { DateRange } from 'react-day-picker'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { columns } from '@/features/tramites/components/columns'
import { TramitesDataTable } from '@/features/tramites/components/tramites-table'
import { TramitesTableToolbar } from '@/features/tramites/components/tramites-table-toolbar'
import {
  useTramitesSearch,
  tramitesFilterSchema,
  type TramitesSearchParams,
} from '@/features/tramites/hooks/use-tramites-search'

// Ruta + Validación
export const Route = createFileRoute('/_authenticated/tramites/')({
  component: TramitesPage,
  validateSearch: tramitesFilterSchema,
})

// --- Fetchers ---
const fetchOficinas = async () => (await api.get('/oficinas')).data
const fetchTipos = async () => (await api.get('/tipos-documento')).data

const fetchTramites = async (params: TramitesSearchParams) => {
  const query = new URLSearchParams()

  // Paginación
  query.set('page', (params.page || 1).toString())
  query.set('limit', (params.limit || 10).toString())

  // Búsqueda Inteligente ('q')
  if (params.q) query.set('q', params.q)

  // Filtros Arrays
  if (params.estado?.length) query.set('estado', params.estado.join(','))
  if (params.prioridad?.length)
    query.set('prioridad', params.prioridad.join(','))
  if (params.oficinaId?.length)
    query.set('oficinaId', params.oficinaId.join(','))
  if (params.tipoDocumentoId?.length)
    query.set('tipoDocumentoId', params.tipoDocumentoId.join(','))

  // Filtros Fechas
  if (params.fechaDocumentoDesde)
    query.set('fechaDocumentoDesde', params.fechaDocumentoDesde)
  if (params.fechaDocumentoHasta)
    query.set('fechaDocumentoHasta', params.fechaDocumentoHasta)
  if (params.creadoDesde) query.set('creadoDesde', params.creadoDesde)
  if (params.creadoHasta) query.set('creadoHasta', params.creadoHasta)

  // Ordenamiento
  if (params.sortBy) query.set('sortBy', params.sortBy)

  const { data } = await api.get(`/tramites?${query.toString()}`)
  return data
}

function TramitesPage() {
  const navigate = Route.useNavigate()
  const searchParams = useTramitesSearch()

  // --- Datos Auxiliares ---
  const { data: oficinas } = useQuery({
    queryKey: ['oficinas'],
    queryFn: fetchOficinas,
    staleTime: 1000 * 60 * 5,
  })
  const { data: tipos } = useQuery({
    queryKey: ['tipos'],
    queryFn: fetchTipos,
    staleTime: 1000 * 60 * 5,
  })

  const oficinasOptions = useMemo(
    () => oficinas?.map((o: any) => ({ label: o.siglas, value: o.id })) || [],
    [oficinas]
  )
  const tiposOptions = useMemo(
    () => tipos?.map((t: any) => ({ label: t.nombre, value: t.id })) || [],
    [tipos]
  )

  // --- Datos Principales ---
  const { data: tramitesData, isLoading } = useQuery({
    queryKey: ['tramites', searchParams],
    queryFn: () => fetchTramites(searchParams),
    placeholderData: (prev) => prev,
  })

  // --- Sincronización URL -> Tabla ---

  // Paginación
  const pagination: PaginationState = {
    pageIndex: (searchParams.page || 1) - 1,
    pageSize: searchParams.limit || 10,
  }

  // Filtros Columnas
  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters = []
    if (searchParams.estado)
      filters.push({ id: 'estado', value: searchParams.estado })
    if (searchParams.prioridad)
      filters.push({ id: 'prioridad', value: searchParams.prioridad })
    if (searchParams.oficinaId)
      filters.push({ id: 'oficinaRemitenteId', value: searchParams.oficinaId })
    if (searchParams.tipoDocumentoId)
      filters.push({
        id: 'tipoDocumentoId',
        value: searchParams.tipoDocumentoId,
      })
    return filters
  }, [searchParams])

  // Ordenamiento
  const sorting = useMemo<SortingState>(() => {
    if (searchParams.sortBy) {
      const [id, desc] = searchParams.sortBy.split(':')
      return [{ id, desc: desc === 'desc' }]
    }
    return []
  }, [searchParams.sortBy])

  // --- Handlers ---

  const onPaginationChange = (updaterOrValue: any) => {
    const next =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(pagination)
        : updaterOrValue
    navigate({
      to: '.',
      search: (prev: any) => ({
        ...prev,
        page: next.pageIndex + 1,
        limit: next.pageSize,
      }),
      replace: true,
    })
  }

  const onColumnFiltersChange = (updaterOrValue: any) => {
    const next =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(columnFilters)
        : updaterOrValue
    const newParams: any = { ...searchParams, page: 1 }
    delete newParams.estado
    delete newParams.prioridad
    delete newParams.oficinaId
    delete newParams.tipoDocumentoId

    next.forEach((filter: any) => {
      if (filter.id === 'estado') newParams.estado = filter.value
      if (filter.id === 'prioridad') newParams.prioridad = filter.value
      if (filter.id === 'oficinaRemitenteId') newParams.oficinaId = filter.value
      if (filter.id === 'tipoDocumentoId')
        newParams.tipoDocumentoId = filter.value
    })
    navigate({ to: '.', search: newParams, replace: true })
  }

  const onSortingChange = (updaterOrValue: any) => {
    const next =
      typeof updaterOrValue === 'function'
        ? updaterOrValue(sorting)
        : updaterOrValue
    if (next.length > 0) {
      navigate({
        to: '.',
        search: (prev: any) => ({
          ...prev,
          sortBy: `${next[0].id}:${next[0].desc ? 'desc' : 'asc'}`,
        }),
        replace: true,
      })
    } else {
      navigate({
        to: '.',
        search: (prev: any) => {
          const { sortBy, ...rest } = prev
          return rest
        },
        replace: true,
      })
    }
  }

  // --- Handlers Búsqueda Global y Fechas ---

  const handleGlobalSearch = (value: string) => {
    navigate({
      to: '.',
      search: (prev: any) => ({ ...prev, q: value || undefined, page: 1 }),
      replace: true,
    })
  }

  const handleDateFilterChange = (
    type: 'documento' | 'registro',
    range: DateRange | undefined
  ) => {
    navigate({
      to: '.',
      search: (prev: any) => {
        const newParams = { ...prev, page: 1 }
        delete newParams.fechaDocumentoDesde
        delete newParams.fechaDocumentoHasta
        delete newParams.creadoDesde
        delete newParams.creadoHasta

        if (range?.from) {
          const fromISO = range.from.toISOString()
          const toISO = range.to ? range.to.toISOString() : fromISO
          if (type === 'documento') {
            newParams.fechaDocumentoDesde = fromISO
            newParams.fechaDocumentoHasta = toISO
          } else {
            newParams.creadoDesde = fromISO
            newParams.creadoHasta = toISO
          }
        }
        return newParams
      },
      replace: true,
    })
  }

  // Estado activo para UI de fechas
  const activeDateRange =
    searchParams.fechaDocumentoDesde || searchParams.creadoDesde
      ? {
          from: new Date(
            searchParams.fechaDocumentoDesde || searchParams.creadoDesde!
          ),
          to: new Date(
            searchParams.fechaDocumentoHasta ||
              searchParams.creadoHasta ||
              searchParams.fechaDocumentoDesde ||
              searchParams.creadoDesde!
          ),
        }
      : undefined
  const activeDateType = searchParams.creadoDesde ? 'registro' : 'documento'

  // --- Tabla ---
  const table = useReactTable({
    data: tramitesData?.data || [],
    columns,
    state: { pagination, columnFilters, sorting },
    onPaginationChange,
    onColumnFiltersChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    pageCount: tramitesData?.meta?.lastPage || 1,
  })

  return (
    <div className='space-y-4 p-4 md:p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Registro de Trámites
          </h2>
          <p className='text-muted-foreground'>
            Administración centralizada de documentos.
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <Button asChild>
            <Link to='/tramites/nuevo'>Nuevo Trámite</Link>
          </Button>
        </div>
      </div>

      <div className='space-y-4'>
        <TramitesTableToolbar
          table={table}
          oficinasOptions={oficinasOptions}
          tiposDocumentoOptions={tiposOptions}
          // CONEXIÓN CRÍTICA: Pasamos los handlers y estado al toolbar
          globalFilter={searchParams.q || ''}
          onGlobalFilterChange={handleGlobalSearch}
          onDateFilterChange={handleDateFilterChange}
          activeDateRange={activeDateRange}
          activeDateType={activeDateType}
        />

        {isLoading ? (
          <div className='text-muted-foreground flex h-24 items-center justify-center'>
            Cargando datos...
          </div>
        ) : (
          <TramitesDataTable table={table} />
        )}
      </div>
    </div>
  )
}
