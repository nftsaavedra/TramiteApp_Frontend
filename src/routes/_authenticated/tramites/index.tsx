// En: src/routes/_authenticated/tramites/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { columns } from '@/features/tramites/components/columns'
import { TramitesDataTable } from '@/features/tramites/components/tramites-table'

export const Route = createFileRoute('/_authenticated/tramites/')({
  component: TramitesPage,
})

function TramitesPage() {
  return (
    <Main>
      <div className='mb-4 flex items-center justify-between space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Gestión de Trámites
        </h1>
        <div className='flex items-center space-x-2'>
          {/* Este enlace nos llevará al formulario de creación */}
          <Button asChild>
            <Link to='/tramites/nuevo'>Nuevo Trámite</Link>
          </Button>
        </div>
      </div>

      {/* Renderiza el componente de la tabla de datos */}
      <TramitesDataTable columns={columns} />
    </Main>
  )
}
