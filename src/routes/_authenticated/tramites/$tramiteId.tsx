// En: src/routes/_authenticated/tramites/$tramiteId.tsx
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import api from '@/lib/api'
import { Main } from '@/components/layout/main'
import { DetallesPrincipales } from '@/features/tramites/components/DetallesPrincipales'
import { HistorialMovimientos } from '@/features/tramites/components/HistorialMovimientos'
import { type TramiteCompleto } from '@/features/tramites/types'

// <-- Importa el nuevo componente

// Placeholder
function GestionAnotaciones({ tramite }: { tramite: TramiteCompleto }) {
  return <div>{/* Próximamente: Gestión de Anotaciones */}</div>
}

const fetchTramiteById = async (
  tramiteId: string
): Promise<TramiteCompleto> => {
  const { data } = await api.get(`/tramites/${tramiteId}`)
  return data
}

export const Route = createFileRoute('/_authenticated/tramites/$tramiteId')({
  component: TramiteDetallePage,
})

function TramiteDetallePage() {
  const { tramiteId } = Route.useParams()

  const {
    data: tramite,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tramite', tramiteId],
    queryFn: () => fetchTramiteById(tramiteId),
  })

  if (isLoading) {
    return (
      <Main>
        <p>Cargando información del trámite...</p>
      </Main>
    )
  }

  if (error) {
    return (
      <Main>
        <p>Error al cargar el trámite. Es posible que no exista.</p>
      </Main>
    )
  }

  if (!tramite) {
    return (
      <Main>
        <p>No se encontró el trámite.</p>
      </Main>
    )
  }

  return (
    <Main>
      <div className='mb-4'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Detalle del Trámite
        </h1>
        <p className='text-muted-foreground'>
          {tramite.numeroDocumentoCompleto}
        </p>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        <div className='space-y-8 lg:col-span-2'>
          <DetallesPrincipales tramite={tramite} />
          {/* Reemplaza el placeholder con el componente real */}
          <HistorialMovimientos movimientos={tramite.movimientos} />
        </div>

        <div className='lg:col-span-1'>
          <GestionAnotaciones tramite={tramite} />
        </div>
      </div>
    </Main>
  )
}
