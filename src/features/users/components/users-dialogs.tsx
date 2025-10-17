// En: src/features/users/components/users-dialogs.tsx

import { UsersActionDialog } from './users-action-dialog'
import { UsersDeleteDialog } from './users-delete-dialog'
// Ya no se necesita el diálogo de "Invite" ni el hook `useUsers` aquí.

export function UsersDialogs() {
  return (
    <>
      <UsersActionDialog />
      <UsersDeleteDialog />
    </>
  )
}