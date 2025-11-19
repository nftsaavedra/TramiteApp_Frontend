import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import {
  getCoreRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  PaginationState,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import api from '@/lib/api'
import { createUsersColumns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider, useUsers, type User } from './components/users-provider'
// --- Componentes Visuales ---
import { UsersTable } from './components/users-table'
import { UsersTableToolbar } from './components/users-table-toolbar'
// --- Hooks y Contexto ---
import {
  useUsersSearch,
  type UsersSearchParams,
} from './hooks/use-users-search'

// 1. API de la Ruta (Vital para leer la URL)
const routeApi = getRouteApi('/_authenticated/admin/usuarios')

// 2. Fetcher del Backend (Restaura filtros y ordenamiento server-side)
const fetchUsers = async (params: UsersSearchParams) => {
  const query = new URLSearchParams()

  // Paginación
  query.set('page', (params.page || 1).toString())
  query.set('limit', (params.limit || 10).toString())

  // Filtros Avanzados
  if (params.q) query.set('q', params.q)
  if (params.role?.length) query.set('role', params.role.join(','))
  if (params.activo) query.set('activo', params.activo)

  // Ordenamiento (Restaura funcionalidad ASC/DESC)
  if (params.sortBy) query.set('sortBy', params.sortBy)

  const { data } = await api.get(`/users?${query.toString()}`)
  return data
}

// 3. Componente Interno (Lógica combinada)
function UsersPageContent() {
  const navigate = routeApi.useNavigate()
  const searchParams = useUsersSearch()

  // Consumimos el contexto para controlar los diálogos
  const { setOpenDialog, setSelectedUser } = useUsers()

  // Carga de datos usando los parámetros de la URL
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', searchParams],
    queryFn: () => fetchUsers(searchParams),
    placeholderData: (prev) => prev,
  })

  // --- ACCIONES CRUD (Conectadas al Contexto) ---

  // Crear: Limpia selección y abre modal 'add'
  const handleCreate = useCallback(() => {
    setSelectedUser(null)
    setOpenDialog('add')
  }, [setOpenDialog, setSelectedUser])

  // Editar: Selecciona usuario y abre modal 'edit'
  const handleEdit = useCallback(
    (user: User) => {
      setSelectedUser(user)
      setOpenDialog('edit')
    },
    [setOpenDialog, setSelectedUser]
  )

  // Eliminar: Selecciona usuario y abre modal 'delete'
  const handleDelete = useCallback(
    (user: User) => {
      setSelectedUser(user)
      setOpenDialog('delete')
    },
    [setOpenDialog, setSelectedUser]
  )

  // --- CONFIGURACIÓN DE TABLA ---

  // Inyectamos las acciones reales en las columnas
  const columns = useMemo(
    () => createUsersColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
  )

  // Estado local de la tabla (Ordenamiento visual)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // Sincronización Paginación -> URL
  const pagination: PaginationState = {
    pageIndex: (searchParams.page || 1) - 1,
    pageSize: searchParams.limit || 10,
  }

  const onPaginationChange = (updater: any) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater
    navigate({
      to: '.',
      search: (prev) => ({
        ...prev,
        page: next.pageIndex + 1,
        limit: next.pageSize,
      }),
      replace: true,
    })
  }

  // Sincronización Filtros -> URL
  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters = []
    if (searchParams.role)
      filters.push({ id: 'role', value: searchParams.role })
    if (searchParams.activo)
      filters.push({ id: 'isActive', value: [searchParams.activo] })
    return filters
  }, [searchParams])

  const onColumnFiltersChange = (updater: any) => {
    const next =
      typeof updater === 'function' ? updater(columnFilters) : updater
    const newParams: any = { ...searchParams, page: 1 }

    // Reseteamos filtros previos en URL
    delete newParams.role
    delete newParams.activo

    // Aplicamos nuevos filtros
    next.forEach((filter: any) => {
      if (filter.id === 'role') newParams.role = filter.value
      if (filter.id === 'isActive') newParams.activo = filter.value?.[0]
    })

    navigate({ to: '.', search: newParams, replace: true })
  }

  // Sincronización Ordenamiento -> URL (Restaura clic en cabeceras)
  const onSortingChange = (updater: any) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater
    setSorting(next)

    // Si hay ordenamiento, lo mandamos a la URL como 'campo:desc'
    if (next.length > 0) {
      const { id, desc } = next[0]
      navigate({
        to: '.',
        search: (prev) => ({
          ...prev,
          sortBy: `${id}:${desc ? 'desc' : 'asc'}`,
        }),
        replace: true,
      })
    } else {
      // Si se quita el orden, limpiamos la URL
      navigate({
        to: '.',
        search: (prev) => {
          const { sortBy, ...rest } = prev
          return rest
        },
        replace: true,
      })
    }
  }

  // Instancia Maestra de la Tabla (Headless UI)
  const table = useReactTable({
    data: usersData?.data || [], // Asumiendo estructura { data: [], meta: {} } del backend
    columns,
    state: {
      pagination,
      columnFilters,
      sorting,
      columnVisibility,
    },
    pageCount: usersData?.meta?.lastPage || 1,
    onPaginationChange,
    onColumnFiltersChange,
    onSortingChange: onSortingChange, // Conectado a la función que actualiza URL
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true, // Indica que el backend maneja la pagina
    manualFiltering: true, // Indica que el backend maneja el filtro
    manualSorting: true, // Indica que el backend maneja el orden
  })

  return (
    <div className='space-y-4 p-4 md:p-6'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Gestión de Usuarios
          </h2>
          <p className='text-muted-foreground'>
            Administre los usuarios, roles y permisos del sistema.
          </p>
        </div>
        {/* Botón Crear conectado al handler real */}
        <UsersPrimaryButtons onCreate={handleCreate} />
      </div>

      {/* Toolbar conectado a la tabla */}
      <UsersTableToolbar
        table={table}
        globalFilter={searchParams.q || ''}
        onGlobalFilterChange={(val) =>
          navigate({
            to: '.',
            search: (prev) => ({
              ...prev,
              q: val || undefined,
              page: 1,
            }),
            replace: true,
          })
        }
      />

      {isLoading ? (
        <div className='text-muted-foreground flex h-24 items-center justify-center'>
          Cargando usuarios...
        </div>
      ) : (
        // Pasamos la instancia completa 'table' (NO columns/data sueltos)
        <UsersTable table={table} />
      )}

      {/* Diálogos CRUD escuchando al Contexto */}
      <UsersDialogs />
    </div>
  )
}

// 4. Exportación Principal (Envoltorio Provider)
export default function UsersPage() {
  return (
    <UsersProvider>
      <UsersPageContent />
    </UsersProvider>
  )
}
