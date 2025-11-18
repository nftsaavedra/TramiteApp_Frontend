import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  getCoreRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table'
import api from '@/lib/api'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { columns } from '@/features/tramites/components/columns'
import { TramitesDataTable } from '@/features/tramites/components/tramites-table'
import { TramitesTableToolbar } from '@/features/tramites/components/tramites-table-toolbar'

// 1. Esquema de Validación de URL (Single Source of Truth para el estado)
const tramitesSearchSchema = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(10),
  asunto: z.string().optional(),
  // Soportamos array en estado interno y string en URL
  estado: z.union([z.string(), z.array(z.string())]).optional(),
  prioridad: z.union([z.string(), z.array(z.string())]).optional(),
  oficinaRemitenteId: z.union([z.string(), z.array(z.string())]).optional(),
  tipoDocumentoId: z.union([z.string(), z.array(z.string())]).optional(),
})

export const Route = createFileRoute('/_authenticated/tramites/')({
  component: TramitesPage,
  validateSearch: tramitesSearchSchema,
})

// --- Servicios de Fetching (Separación de la capa de datos) ---
const fetchOficinas = async () => (await api.get('/oficinas')).data
const fetchTipos = async () => (await api.get('/tipos-documento')).data

const fetchTramites = async (params: any) => {
  const query = new URLSearchParams()
  query.set('page', params.page.toString())
  query.set('limit', params.pageSize.toString())

  if (params.asunto) query.set('q', params.asunto)

  // Serialización manual para garantizar formato "A,B" compatible con el Backend
  if (params.estado)
    query.set(
      'estado',
      Array.isArray(params.estado) ? params.estado.join(',') : params.estado
    )
  if (params.prioridad)
    query.set(
      'prioridad',
      Array.isArray(params.prioridad)
        ? params.prioridad.join(',')
        : params.prioridad
    )
  if (params.oficinaRemitenteId)
    query.set(
      'oficinaId',
      Array.isArray(params.oficinaRemitenteId)
        ? params.oficinaRemitenteId.join(',')
        : params.oficinaRemitenteId
    )
  if (params.tipoDocumentoId)
    query.set(
      'tipoDocumentoId',
      Array.isArray(params.tipoDocumentoId)
        ? params.tipoDocumentoId.join(',')
        : params.tipoDocumentoId
    )

  const { data } = await api.get(`/tramites?${query.toString()}`)
  return data
}

function TramitesPage() {
  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  // 2. Gestión de Estado URL (DRY: Reutilizamos lógica compleja)
  const {
    pagination,
    columnFilters,
    onPaginationChange,
    onColumnFiltersChange,
  } = useTableUrlState({
    search,
    navigate,
    columnFilters: [
      { columnId: 'asunto', searchKey: 'asunto', type: 'string' },
      {
        columnId: 'estado',
        searchKey: 'estado',
        type: 'array',
        serialize: (v) => (Array.isArray(v) ? v.join(',') : v),
        deserialize: (v) => (typeof v === 'string' ? v.split(',') : v),
      },
      {
        columnId: 'prioridad',
        searchKey: 'prioridad',
        type: 'array',
        serialize: (v) => (Array.isArray(v) ? v.join(',') : v),
        deserialize: (v) => (typeof v === 'string' ? v.split(',') : v),
      },
      {
        columnId: 'oficinaRemitenteId',
        searchKey: 'oficinaRemitenteId',
        type: 'array',
        serialize: (v) => (Array.isArray(v) ? v.join(',') : v),
        deserialize: (v) => (typeof v === 'string' ? v.split(',') : v),
      },
      {
        columnId: 'tipoDocumentoId',
        searchKey: 'tipoDocumentoId',
        type: 'array',
        serialize: (v) => (Array.isArray(v) ? v.join(',') : v),
        deserialize: (v) => (typeof v === 'string' ? v.split(',') : v),
      },
    ],
  })

  // 3. Carga de Datos Dinámicos (Para los filtros)
  const { data: oficinas } = useQuery({
    queryKey: ['oficinas'],
    queryFn: fetchOficinas,
  })
  const { data: tipos } = useQuery({ queryKey: ['tipos'], queryFn: fetchTipos })

  // Adaptador de datos (Adapter Pattern ligero)
  const oficinasOptions =
    oficinas?.map((o: any) => ({ label: o.siglas, value: o.id })) || []
  const tiposOptions =
    tipos?.map((t: any) => ({ label: t.nombre, value: t.id })) || []

  // 4. Carga de Datos Principales
  const { data: tramitesData, isLoading } = useQuery({
    queryKey: ['tramites', pagination, columnFilters],
    queryFn: () => {
      // Transformación de estado de TanStack a API
      const apiFilters = columnFilters.reduce(
        (acc, filter) => {
          acc[filter.id] = filter.value
          return acc
        },
        {} as Record<string, any>
      )

      return fetchTramites({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        ...apiFilters,
      })
    },
  })

  // 5. Instancia de la Tabla (Composition Root de la tabla)
  const table = useReactTable({
    data: tramitesData?.data || [],
    columns,
    state: { pagination, columnFilters },
    onPaginationChange,
    onColumnFiltersChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualFiltering: true,
    pageCount: tramitesData?.meta?.lastPage || 1,
  })

  return (
    <div className='space-y-4 p-4 md:p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Gestión de Trámites
          </h2>
          <p className='text-muted-foreground'>
            Visualice y gestione todos los trámites del sistema.
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <Button asChild>
            <Link to='/tramites/nuevo'>Nuevo Trámite</Link>
          </Button>
        </div>
      </div>

      <div className='space-y-4'>
        {/* Inyección de Dependencias en UI: Pasamos la tabla y las opciones */}
        <TramitesTableToolbar
          table={table}
          oficinasOptions={oficinasOptions}
          tiposDocumentoOptions={tiposOptions}
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
