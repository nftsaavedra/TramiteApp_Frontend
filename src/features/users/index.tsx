// En: src/features/users/index.tsx
import React from 'react'
import { createUsersColumns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider, useUsers } from './components/users-provider'
import { UsersTable } from './components/users-table'

/**
 * Componente interno que consume el contexto y ensambla la UI.
 * Esta separación asegura que los hooks que consumen el contexto (useUsers)
 * siempre se ejecuten dentro del Provider.
 */
function UsersPageContent() {
  // 1. Se consumen las propiedades correctas del contexto: `setOpenDialog` y `setSelectedUser`
  const { usersQuery, setOpenDialog, setSelectedUser } = useUsers()

  const handleCreate = () => {
    setSelectedUser(null) // Limpiamos cualquier selección previa
    setOpenDialog('add') // Usamos la función correcta para abrir el diálogo de 'añadir'
  }

  // 2. Las columnas se memoizan y se les inyectan las funciones
  //    para editar y eliminar, utilizando la nomenclatura correcta del contexto.
  const columns = React.useMemo(
    () =>
      createUsersColumns({
        onEdit: (user) => {
          setSelectedUser(user)
          setOpenDialog('edit')
        },
        onDelete: (user) => {
          setSelectedUser(user)
          setOpenDialog('delete')
        },
      }),
    [setSelectedUser, setOpenDialog]
  )

  return (
    // 3. Se utiliza el layout estándar con un `div` simple, eliminando <Header> y <Main>.
    <div className='space-y-4 p-4 md:p-6'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Gestión de Usuarios
          </h2>
          <p className='text-muted-foreground'>
            Cree, edite y administre los usuarios y sus roles aquí.
          </p>
        </div>
        <UsersPrimaryButtons onCreate={handleCreate} />
      </div>

      {usersQuery.isLoading && <p>Cargando usuarios...</p>}
      {usersQuery.error && (
        <p className='text-destructive'>Error al cargar los usuarios.</p>
      )}
      {usersQuery.data && (
        <UsersTable columns={columns} data={usersQuery.data} />
      )}

      {/* El componente de diálogos ya está conectado al Provider y no necesita props */}
      <UsersDialogs />
    </div>
  )
}

/**
 * El componente principal exportado. Su única responsabilidad es
 * envolver la página con el UsersProvider.
 */
export function Users() {
  return (
    <UsersProvider>
      <UsersPageContent />
    </UsersProvider>
  )
}
