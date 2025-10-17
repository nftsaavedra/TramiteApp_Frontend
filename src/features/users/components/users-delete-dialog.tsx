// En: src/features/users/components/users-delete-dialog.tsx

'use client'

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
import { useUsers } from './users-provider'

// En: src/features/users/components/users-delete-dialog.tsx

export function UsersDeleteDialog() {
  const { openDialog, setOpenDialog, selectedUser, deleteMutation } = useUsers()

  const isOpen = openDialog === 'delete'

  const handleDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={() => setOpenDialog(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente al
            usuario
            <strong className='mx-1'>{selectedUser?.name}</strong>
            del sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending
              ? 'Eliminando...'
              : 'Confirmar y Eliminar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
