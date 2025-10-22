// En: src/routes/_authenticated/tramites/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
// 1. Se elimina la importación del componente <Main>
import { columns } from '@/features/tramites/components/columns'
import { TramitesDataTable } from '@/features/tramites/components/tramites-table'

export const Route = createFileRoute('/_authenticated/tramites/')({
  component: TramitesPage,
})

function TramitesPage() {
  return (
    // 2. Se reemplaza <Main> por un <div> con el padding estándar
    <div className='space-y-4 p-4 md:p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Gestión de Trámites
          </h2>
          <p className='text-muted-foreground'>
            Visualice y gestione todos los trámites del sistema.
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <Button asChild>
            <Link to='/tramites/nuevo'>Nuevo Trámite</Link>
          </Button>
        </div>
      </div>

      <TramitesDataTable columns={columns} />
    </div>
  )
}
