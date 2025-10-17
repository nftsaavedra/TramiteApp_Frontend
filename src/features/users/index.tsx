// En: src/features/users/index.tsx
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { createUsersColumns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider, useUsers } from './components/users-provider'
import { UsersTable } from './components/users-table'

/**
 * Componente interno que consume el contexto.
 * Esto es una buena práctica para asegurar que los componentes que usan el hook
 * siempre se rendericen dentro del Provider.
 */
function UsersPageContent() {
  const { usersQuery, setOpenDialog, setSelectedUser } = useUsers()

  const handleCreate = () => {
    setSelectedUser(null)
    setOpenDialog('add')
  }

  // Las columnas se memoizan para evitar re-renderizados innecesarios.
  // Se le pasan las funciones de acción directamente.
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
    <>
      <Header fixed>
        {/* El Header puede permanecer como está o simplificarse según su necesidad */}
        <div className='flex w-full items-center justify-between'>
          <h1 className='text-xl font-bold'>Gestión de Usuarios</h1>
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 p-4 sm:gap-6 md:p-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Lista de Usuarios
            </h2>
            <p className='text-muted-foreground'>
              Administre los usuarios y sus roles aquí.
            </p>
          </div>
          {/* El botón de crear ahora usa la función del contexto */}
          <UsersPrimaryButtons onCreate={handleCreate} />
        </div>

        {/* La tabla ahora recibe los datos reales de la consulta */}
        {usersQuery.isLoading && <p>Cargando usuarios...</p>}
        {usersQuery.error && (
          <p className='text-destructive'>Error al cargar los usuarios.</p>
        )}
        {usersQuery.data && (
          <UsersTable columns={columns} data={usersQuery.data} />
        )}
      </Main>

      {/* El componente de diálogos ya está conectado al Provider */}
      <UsersDialogs />
    </>
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
