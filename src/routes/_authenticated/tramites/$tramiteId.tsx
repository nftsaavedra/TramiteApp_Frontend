// En: src/routes/_authenticated/tramites/$tramiteId.tsx
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { DetallesPrincipales } from '@/features/tramites/components/DetallesPrincipales'
import { HistorialMovimientos } from '@/features/tramites/components/HistorialMovimientos'
import { TramiteActions } from '@/features/tramites/components/TramiteActions'
import { type TramiteCompleto } from '@/features/tramites/types'

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
  const router = useRouter()

  const {
    data: tramite,
    isLoading,
    error,
    refetch,
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
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => router.history.back()}
              className='h-8 w-8'
              title='Volver'
            >
              <ArrowLeft className='h-4 w-4' />
            </Button>
            <h1 className='text-3xl font-bold tracking-tight'>Detalle</h1>
          </div>
        </div>

        <div className='flex items-center gap-2 sm:self-start'>
          <TramiteActions tramite={tramite} />
          <Button
            variant='outline'
            size='sm'
            onClick={() => refetch()}
            className='gap-2'
          >
            <RefreshCw className='h-4 w-4' />
            Actualizar
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* COLUMNA LATERAL (IZQUIERDA): Detalles */}
        <div className='space-y-6'>
          <DetallesPrincipales tramite={tramite} />
        </div>

        {/* COLUMNA PRINCIPAL (DERECHA): Historial */}
        <div className='space-y-8 lg:col-span-2'>
          <HistorialMovimientos
            movimientos={tramite.movimientos}
            tramiteAsunto={tramite.asunto}
            tramiteId={tramite.id}
            tramiteEstado={tramite.estado}
            tramiteFechaCierre={tramite.fechaCierre}
            anotaciones={tramite.anotaciones}
          />
        </div>
      </div>
    </Main>
  )
}
