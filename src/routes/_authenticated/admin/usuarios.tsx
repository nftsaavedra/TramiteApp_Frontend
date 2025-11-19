import { useCallback, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
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
import { createUsersColumns } from '@/features/users/components/users-columns'
import { UsersDialogs } from '@/features/users/components/users-dialogs'
import { UsersPrimaryButtons } from '@/features/users/components/users-primary-buttons'
import {
  UsersProvider,
  useUsers,
  type User,
} from '@/features/users/components/users-provider'
// --- Importaciones Absolutas desde Features ---
import { UsersTable } from '@/features/users/components/users-table'
import { UsersTableToolbar } from '@/features/users/components/users-table-toolbar'
// --- Hooks y Contexto ---
import {
  useUsersSearch,
  usersFilterSchema,
  type UsersSearchParams,
} from '@/features/users/hooks/use-users-search'

// 1. Definición de la Ruta
export const Route = createFileRoute('/_authenticated/admin/usuarios')({
  component: UsersPage,
  validateSearch: usersFilterSchema, // Validación Zod automática
})

// 2. Fetcher de Usuarios (Con soporte para Filtros, Paginación y Orden)
const fetchUsers = async (params: UsersSearchParams) => {
  const query = new URLSearchParams()

  // Paginación
  query.set('page', (params.page || 1).toString())
  query.set('limit', (params.limit || 10).toString())

  // Filtros
  if (params.q) query.set('q', params.q)
  if (params.role?.length) query.set('role', params.role.join(','))
  if (params.activo) query.set('activo', params.activo)

  // Ordenamiento
  if (params.sortBy) query.set('sortBy', params.sortBy)

  const { data } = await api.get(`/users?${query.toString()}`)
  return data
}

// 3. Componente de Contenido (Lógica de UI)
function UsersPageContent() {
  // Hooks de navegación y URL
  const navigate = Route.useNavigate()
  const searchParams = useUsersSearch()

  // Consumo del Contexto (Provider)
  const { setOpenDialog, setSelectedUser } = useUsers()

  // Query de Datos
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', searchParams],
    queryFn: () => fetchUsers(searchParams),
    placeholderData: (prev) => prev, // Mantiene datos anteriores mientras carga
  })

  // --- HANDLERS REALES (CRUD) ---

  const handleCreate = useCallback(() => {
    setSelectedUser(null)
    setOpenDialog('add')
  }, [setOpenDialog, setSelectedUser])

  const handleEdit = useCallback(
    (user: User) => {
      setSelectedUser(user)
      setOpenDialog('edit')
    },
    [setOpenDialog, setSelectedUser]
  )

  const handleDelete = useCallback(
    (user: User) => {
      setSelectedUser(user)
      setOpenDialog('delete')
    },
    [setOpenDialog, setSelectedUser]
  )

  // --- CONFIGURACIÓN DE COLUMNAS ---
  // Inyectamos los handlers reales en las columnas
  const columns = useMemo(
    () => createUsersColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete]
  )

  // Estado Local de Tabla
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  // --- SINCRONIZACIÓN DE ESTADO (URL <-> TABLA) ---

  // 1. Paginación
  const pagination: PaginationState = {
    pageIndex: (searchParams.page || 1) - 1,
    pageSize: searchParams.limit || 10,
  }

  const onPaginationChange = (updater: any) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater
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

  // 2. Filtros de Columna
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
    const newParams: any = { ...searchParams, page: 1 } // Reset a pág 1 al filtrar

    delete newParams.role
    delete newParams.activo

    next.forEach((filter: any) => {
      if (filter.id === 'role') newParams.role = filter.value
      if (filter.id === 'isActive') newParams.activo = filter.value?.[0]
    })

    navigate({ to: '.', search: newParams, replace: true })
  }

  // 3. Ordenamiento (ASC/DESC)
  const onSortingChange = (updater: any) => {
    const next = typeof updater === 'function' ? updater(sorting) : updater
    setSorting(next)

    if (next.length > 0) {
      const { id, desc } = next[0]
      navigate({
        to: '.',
        search: (prev: any) => ({
          ...prev,
          sortBy: `${id}:${desc ? 'desc' : 'asc'}`,
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

  // --- INSTANCIA DE LA TABLA ---
  const table = useReactTable({
    data: usersData?.data || [],
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
    onSortingChange: onSortingChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
  })

  return (
    <div className='space-y-4 p-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Gestión de Usuarios
          </h2>
          <p className='text-muted-foreground'>
            Administre el acceso y roles del personal.
          </p>
        </div>
        {/* Botón de Crear conectado al handler real */}
        <UsersPrimaryButtons onCreate={handleCreate} />
      </div>

      <div className='space-y-4'>
        <UsersTableToolbar
          table={table}
          globalFilter={searchParams.q || ''}
          onGlobalFilterChange={(val) =>
            navigate({
              to: '.',
              search: (prev: any) => ({
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
          <UsersTable table={table} />
        )}

        {/* Diálogos CRUD (Escuchan al Contexto) */}
        <UsersDialogs />
      </div>
    </div>
  )
}

// 4. Componente Principal (Wrapper con Provider)
function UsersPage() {
  return (
    <UsersProvider>
      <UsersPageContent />
    </UsersProvider>
  )
}
