// En: src/routes/_authenticated/admin/oficinas.tsx
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { columns, Oficina } from '@/features/admin/oficinas/components/columns'
import { OficinaForm } from '@/features/admin/oficinas/components/oficina-form'
import { OficinasDataTable } from '@/features/admin/oficinas/components/oficinas-table'
import { OficinaFormValues } from '@/features/admin/oficinas/data/schema'

export const Route = createFileRoute('/_authenticated/admin/oficinas')({
  component: AdminOficinas,
})

// --- FUNCIONES DE API ---
const fetchOficinas = async (): Promise<Oficina[]> => {
  const { data } = await api.get('/oficinas')
  return Array.isArray(data) ? data : []
}
const createOficina = (newData: OficinaFormValues) =>
  api.post('/oficinas', newData)
const updateOficina = ({
  id,
  ...updateData
}: { id: string } & OficinaFormValues) =>
  api.patch(`/oficinas/${id}`, updateData)
const deleteOficina = (id: string) => api.delete(`/oficinas/${id}`)

function AdminOficinas() {
  const queryClient = useQueryClient()

  // --- ESTADO PARA GESTIONAR DIÁLOGOS Y DATOS SELECCIONADOS ---
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [selectedOficina, setSelectedOficina] = React.useState<Oficina | null>(
    null
  )

  const { data, isLoading, error } = useQuery({
    queryKey: ['oficinas'],
    queryFn: fetchOficinas,
  })

  // --- MUTACIONES (CREATE, UPDATE, DELETE) ---
  const handleMutation = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['oficinas'] })
      closeDialogs()
    },
    onError: (error: any) => {
      toast.error(
        `Error: ${error.response?.data?.message || 'No se pudo realizar la operación.'}`
      )
    },
  }

  const createMutation = useMutation({
    mutationFn: createOficina,
    ...handleMutation,
    onSuccess: () => {
      handleMutation.onSuccess()
      toast.success('Oficina creada exitosamente.')
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateOficina,
    ...handleMutation,
    onSuccess: () => {
      handleMutation.onSuccess()
      toast.success('Oficina actualizada exitosamente.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteOficina,
    ...handleMutation,
    onSuccess: () => {
      handleMutation.onSuccess()
      toast.success('Oficina eliminada exitosamente.')
    },
  })

  // --- MANEJADORES DE ACCIONES ---
  const openForm = (oficina: Oficina | null = null) => {
    setSelectedOficina(oficina)
    setIsFormOpen(true)
  }

  const openDeleteDialog = (oficina: Oficina) => {
    setSelectedOficina(oficina)
    setIsDeleteDialogOpen(true)
  }

  const closeDialogs = () => {
    setIsFormOpen(false)
    setIsDeleteDialogOpen(false)
    setSelectedOficina(null)
  }

  const handleFormSubmit = (values: OficinaFormValues) => {
    if (selectedOficina) {
      updateMutation.mutate({ id: selectedOficina.id, ...values })
    } else {
      createMutation.mutate(values)
    }
  }

  if (isLoading) return <div className='p-6'>Cargando oficinas...</div>
  if (error)
    return (
      <div className='text-destructive p-6'>Error al cargar los datos.</div>
    )

  return (
    <div className='space-y-4 p-4 md:p-6'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>
          Gestión de Oficinas
        </h2>
        <p className='text-muted-foreground'>
          Cree, edite y administre las oficinas del sistema.
        </p>
      </div>

      {/* Pasamos los manejadores de acciones a la tabla */}
      <OficinasDataTable
        columns={columns}
        data={data || []}
        {...({ onEdit: openForm, onDelete: openDeleteDialog, onCreate: () => openForm(null) } as any)}
      />

      {/* --- DIÁLOGO PARA CREAR/EDITAR --- */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {selectedOficina ? 'Editar Oficina' : 'Crear Nueva Oficina'}
            </DialogTitle>
          </DialogHeader>
          <OficinaForm
            onSubmit={handleFormSubmit}
            defaultValues={
              selectedOficina
                ? {
                    nombre: selectedOficina.nombre,
                    siglas: selectedOficina.siglas,
                    tipo: selectedOficina.tipo as OficinaFormValues['tipo'],
                    parentId: (selectedOficina as any)?.parentId ?? undefined,
                  }
                : undefined
            }
          />
        </DialogContent>
      </Dialog>

      {/* --- DIÁLOGO DE CONFIRMACIÓN PARA ELIMINAR --- */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              oficina
              <strong> "{selectedOficina?.nombre}"</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                selectedOficina && deleteMutation.mutate(selectedOficina.id)
              }
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
