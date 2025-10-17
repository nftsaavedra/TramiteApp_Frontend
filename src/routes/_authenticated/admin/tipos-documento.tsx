// En: src/routes/_authenticated/admin/tipos-documento.tsx
import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
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
import { TipoDocumentoFormValues } from '@/features/admin/tipos-documento/data/schema'

export const Route = createFileRoute('/_authenticated/admin/tipos-documento')({
  component: AdminTiposDocumento,
})

// Definimos el tipo aquí para usarlo en todo el archivo
export type TipoDocumento = {
  id: string
  nombre: string
  descripcion: string | null
  isActive: boolean
}

// --- FUNCIONES DE API ---
const fetchTiposDocumento = async (): Promise<TipoDocumento[]> => {
  const { data } = await api.get('/tipos-documento')
  return Array.isArray(data) ? data : []
}
const createTipoDocumento = (newData: TipoDocumentoFormValues) =>
  api.post('/tipos-documento', newData)
const updateTipoDocumento = ({
  id,
  ...updateData
}: { id: string } & TipoDocumentoFormValues) =>
  api.patch(`/tipos-documento/${id}`, updateData)
const deleteTipoDocumento = (id: string) => api.delete(`/tipos-documento/${id}`)

function AdminTiposDocumento() {
  const queryClient = useQueryClient()

  // --- ESTADO PARA GESTIONAR DIÁLOGOS Y DATOS SELECCIONADOS ---
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<TipoDocumento | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['tipos-documento'],
    queryFn: fetchTiposDocumento,
  })

  // --- MUTACIONES (CREATE, UPDATE, DELETE) ---
  const handleMutation = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipos-documento'] })
      closeDialogs()
    },
    onError: (error: any) => {
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
  const openForm = (item: TipoDocumento | null = null) => {
    setSelected(item)
    setIsFormOpen(true)
  }

  const openDeleteDialog = (item: TipoDocumento) => {
    setSelected(item)
    setIsDeleteDialogOpen(true)
  }

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
    []
  )

  if (isLoading) return <div className='p-6'>Cargando datos...</div>
  if (error)
    return (
      <div className='text-destructive p-6'>Error al cargar los datos.</div>
    )

  return (
    <div className='space-y-4 p-4 md:p-6'>
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
