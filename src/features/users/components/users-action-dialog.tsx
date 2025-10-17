// En: src/features/users/components/users-action-dialog.tsx

'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { UserFormValues } from '../data/schema'
import { UserForm } from './user-form'
import { useUsers } from './users-provider'

// En: src/features/users/components/users-action-dialog.tsx

export function UsersActionDialog() {
  const {
    openDialog,
    setOpenDialog,
    selectedUser,
    oficinasQuery,
    createMutation,
    updateMutation,
  } = useUsers()

  const isEditing = !!selectedUser
  // Este diálogo se abre tanto para 'add' como para 'edit'
  const isOpen = openDialog === 'add' || openDialog === 'edit'

  const handleSubmit = (values: UserFormValues) => {
    if (isEditing && selectedUser) {
      updateMutation.mutate({ id: selectedUser.id, ...values })
    } else {
      createMutation.mutate(values)
    }
  }

  // Se renderiza el diálogo solo si está abierto.
  if (!isOpen) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => setOpenDialog(null)}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEditing ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Actualice los datos del usuario aquí. '
              : 'Cree un nuevo usuario aquí. '}
            Click en guardar cuando haya terminado.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          onSubmit={handleSubmit}
          isPending={createMutation.isPending || updateMutation.isPending}
          defaultValues={selectedUser || undefined}
          oficinasList={oficinasQuery.data || []}
        />
      </DialogContent>
    </Dialog>
  )
}
