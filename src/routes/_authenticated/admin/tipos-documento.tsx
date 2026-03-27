// En: src/routes/_authenticated/admin/tipos-documento.tsx
import * as React from 'react'
import { useMemo } from 'react'
import { type AxiosError } from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { type ColumnFiltersState, type SortingState } from '@tanstack/react-table'
import { toast } from 'sonner'
import api from '@/lib/api'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
// Importaciones de componentes genéricos y de UI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createTiposDocumentoColumns } from '@/features/admin/tipos-documento/components/columns'
// Importaciones específicas del módulo que estamos creando
import { TipoDocumentoForm } from '@/features/admin/tipos-documento/components/tipo-documento-form'
import { TiposDocumentoDataTable } from '@/features/admin/tipos-documento/components/tipos-documento-table'
import { type TipoDocumentoFormValues } from '@/features/admin/tipos-documento/data/schema'
import {
  useTiposDocumentoSearch,
  tiposDocumentoFilterSchema,
} from '@/features/admin/tipos-documento/hooks/use-tipos-documento-search'

export const Route = createFileRoute('/_authenticated/admin/tipos-documento')({
  component: AdminTiposDocumento,
  validateSearch: tiposDocumentoFilterSchema,
})

// Definimos el tipo aquí para usarlo en todo el archivo
export type TipoDocumento = {
  id: string
  nombre: string
  descripcion: string | null
  isActive: boolean
}

// --- FUNCIONES DE API ---
const fetchTiposDocumento = async (
  searchParams: ReturnType<typeof useTiposDocumentoSearch>
): Promise<TipoDocumento[]> => {
  const params = new URLSearchParams()
  
  // Búsqueda global (q)
  if (searchParams.q) {
    params.set('q', searchParams.q)
  }
  
  // Ordenamiento
  if (searchParams.sortBy) {
    params.set('sortBy', searchParams.sortBy)
  }
  
  const { data } = await api.get('/api/tipos-documento', { params })
  return Array.isArray(data) ? data : []
}
const createTipoDocumento = (newData: TipoDocumentoFormValues) =>
  api.post('/api/tipos-documento', newData)
const updateTipoDocumento = ({
  id,
  ...updateData
}: { id: string } & TipoDocumentoFormValues) =>
  api.patch(`/api/tipos-documento/${id}`, updateData)
const deleteTipoDocumento = (id: string) => api.delete(`/api/tipos-documento/${id}`)

function AdminTiposDocumento() {
  const queryClient = useQueryClient()
  const searchParams = useTiposDocumentoSearch()

  // --- ESTADO PARA GESTIONAR DIÁLOGOS Y DATOS SELECCIONADOS ---
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<TipoDocumento | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['tipos-documento', searchParams],
    queryFn: () => fetchTiposDocumento(searchParams),
  })
  
  // --- Sincronización URL -> Tabla (Filtros de Columnas) ---
  const urlColumnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = []
    // Aquí irían filtros específicos si los hubiera en el futuro
    return filters
  }, [searchParams])
  
  // Sincronizar estado local con URL
  React.useEffect(() => {
    setColumnFilters(urlColumnFilters)
  }, [urlColumnFilters])

  // --- MUTACIONES (CREATE, UPDATE, DELETE) ---
  const handleMutation = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-documento'] })
      closeDialogs()
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        `Error: ${error.response?.data?.message || 'No se pudo realizar la operación.'}`
      )
    },
  }

  const createMutation = useMutation({
    mutationFn: createTipoDocumento,
    ...handleMutation,
    onSuccess: () => {
      handleMutation.onSuccess()
      toast.success('Tipo de documento creado exitosamente.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateTipoDocumento,
    ...handleMutation,
    onSuccess: () => {
      handleMutation.onSuccess()
      toast.success('Tipo de documento actualizado exitosamente.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTipoDocumento,
    ...handleMutation,
    onSuccess: () => {
      handleMutation.onSuccess()
      toast.success('Tipo de documento eliminado exitosamente.')
    },
  })

  // --- MANEJADORES DE ACCIONES ---
  const openForm = React.useCallback((item: TipoDocumento | null = null) => {
    setSelected(item)
    setIsFormOpen(true)
  }, [])

  const openDeleteDialog = React.useCallback((item: TipoDocumento) => {
    setSelected(item)
    setIsDeleteDialogOpen(true)
  }, [])

  const closeDialogs = () => {
    setIsFormOpen(false)
    setIsDeleteDialogOpen(false)
    setSelected(null)
  }

  const handleFormSubmit = (values: TipoDocumentoFormValues) => {
    if (selected) {
      updateMutation.mutate({ id: selected.id, ...values })
    } else {
      createMutation.mutate(values)
    }
  }

  // Se pasan los manejadores a la función que crea las columnas
  const columns = React.useMemo(
    () =>
      createTiposDocumentoColumns({
        onEdit: openForm,
        onDelete: openDeleteDialog,
      }),
    [openForm, openDeleteDialog]
  )

  if (isLoading) return <div className='p-6'>Cargando datos...</div>
  if (error)
    return (
      <div className='text-destructive p-6'>Error al cargar los datos.</div>
    )

  return (
    <div className='w-full space-y-6 p-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>
          Gestión de Tipos de Documento
        </h2>
        <p className='text-muted-foreground'>
          Cree, edite y administre los tipos de documento del sistema.
        </p>
      </div>

      <TiposDocumentoDataTable
        columns={columns}
        data={data || []}
        onCreate={() => openForm(null)}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        sorting={sorting}
        setSorting={setSorting}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {selected
                ? 'Editar Tipo de Documento'
                : 'Crear Nuevo Tipo de Documento'}
            </DialogTitle>
          </DialogHeader>
          <TipoDocumentoForm
            onSubmit={handleFormSubmit}
            defaultValues={
              selected
                ? { ...selected, descripcion: selected.descripcion || '' }
                : undefined
            }
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              tipo de documento
              <strong> "{selected?.nombre}"</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selected && deleteMutation.mutate(selected.id)}
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
