// En: src/routes/_authenticated/tramites/nuevo.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { TramiteForm } from '@/features/tramites/components/TramiteForm'

export const Route = createFileRoute('/_authenticated/tramites/nuevo')({
  component: NuevoTramitePage,
})

function NuevoTramitePage() {
  return (
    <Main fluid className='w-full'>
      <div className='w-full space-y-6 p-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Nuevo Trámite</h1>
          <p className='text-muted-foreground'>
            Rellene los campos para registrar un nuevo documento en el sistema.
          </p>
        </div>
        <TramiteForm />
      </div>
    </Main>
  )
}
