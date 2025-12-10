// En: src/features/tramites/components/DetallesPrincipales.tsx
import {
  Building,
  Calendar,
  MapPin,
  AlertOctagon,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { type TramiteCompleto } from '@/features/tramites/types'
import {
  obtenerUbicacionActual,
  obtenerConfiguracionPlazo,
} from '../utils/tramite-helpers'

interface DetallesPrincipalesProps {
  tramite: TramiteCompleto
}

export function DetallesPrincipales({ tramite }: DetallesPrincipalesProps) {
  // Lógica derivada
  const ubicacionActual = obtenerUbicacionActual(tramite)
  const configPlazo = obtenerConfiguracionPlazo(tramite.plazo.estado)
  const IconoPlazo = configPlazo.icon

  const estadoVariant =
    tramite.estado === 'FINALIZADO'
      ? 'secondary'
      : tramite.estado === 'ARCHIVADO'
        ? 'outline'
        : 'default'

  const prioridadColor =
    tramite.prioridad === 'URGENTE'
      ? 'text-red-600 bg-red-50 border-red-200'
      : tramite.prioridad === 'ALTA'
        ? 'text-orange-600 bg-orange-50 border-orange-200'
        : 'text-slate-600 bg-slate-50 border-slate-200'

  return (
    <Card className='overflow-hidden shadow-sm transition-all hover:shadow-md'>
      <CardContent className='space-y-5 p-5'>
        {/* 1. HEADER: IDENTIDAD DEL DOCUMENTO */}
        <div className='flex flex-col gap-2'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1'>
              <div className='mb-1.5 flex items-center gap-2'>
                <Badge
                  variant='outline'
                  className={`h-5 px-1.5 py-0 text-[10px] font-bold tracking-wider uppercase ${prioridadColor}`}
                >
                  {tramite.prioridad}
                </Badge>
                <Badge
                  variant={estadoVariant}
                  className='h-5 px-2 py-0 text-[10px] font-bold uppercase'
                >
                  {tramite.estado.replace('_', ' ')}
                </Badge>
              </div>
              <h2 className='text-foreground text-xl leading-tight font-bold tracking-tight text-balance md:text-2xl'>
                {tramite.nombreDocumentoCompleto}
              </h2>
              <div className='text-muted-foreground mt-1.5 flex items-center gap-2 text-sm'>
                <span className='text-foreground/80 font-medium'>
                  {tramite.tipoDocumento.nombre}
                </span>
                <span className='text-slate-300'>•</span>
                <div className='flex items-center gap-1.5'>
                  <Calendar className='h-3.5 w-3.5 text-slate-400' />
                  <span title='Fecha del Documento (Cargo)'>
                    {formatDate(tramite.fechaRecepcion, 'dd MMM yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. PLAZO (Destacado si aplica) */}
        {tramite.plazo.estado !== 'NO_APLICA' && (
          <div
            className={`flex items-start gap-3 rounded-lg border p-3 ${configPlazo.bgClass}`}
          >
            <div
              className={`bg-background/60 mt-0.5 rounded-full p-1.5 shadow-sm ${configPlazo.textClass}`}
            >
              <IconoPlazo className='h-3.5 w-3.5' />
            </div>
            <div className='space-y-0.5'>
              <p className={`text-sm font-bold ${configPlazo.textClass}`}>
                {configPlazo.label}
              </p>
              {tramite.plazo.diasTranscurridos !== null && (
                <p className='text-foreground/80 text-xs'>
                  Han transcurrido{' '}
                  <strong className='font-mono font-semibold'>
                    {tramite.plazo.diasTranscurridos}
                  </strong>{' '}
                  días hábiles.
                </p>
              )}
            </div>
          </div>
        )}

        {/* 3. ASUNTO */}
        <div className='space-y-1'>
          <h3 className='text-[10px] font-semibold tracking-wide text-slate-500 uppercase'>
            Asunto
          </h3>
          <p className='text-foreground text-sm leading-relaxed font-medium text-balance'>
            {tramite.asunto}
          </p>
        </div>

        <Separator className='bg-slate-100' />

        {/* 4. CONTEXTO ORIGEN -> ACTUAL */}
        <div className='grid gap-4 sm:grid-cols-2'>
          {/* Remitente */}
          <div className='space-y-1'>
            <div className='mb-0.5 flex items-center gap-1.5 text-xs text-slate-500'>
              <Building className='h-3.5 w-3.5' />
              <span className='text-[10px] font-medium tracking-wide uppercase'>
                Remitente
              </span>
            </div>
            <div className='text-sm font-semibold text-slate-800'>
              {tramite.oficinaRemitente.nombre}
            </div>
            <div className='font-mono text-xs text-slate-500'>
              {tramite.oficinaRemitente.siglas}
            </div>
          </div>

          {/* Ubicación (Destino Actual) */}
          <div className='space-y-1'>
            <div className='mb-0.5 flex items-center gap-1.5 text-xs text-slate-500'>
              <MapPin className='h-3.5 w-3.5' />
              <span className='text-[10px] font-medium tracking-wide uppercase'>
                Ubicación Actual
              </span>
            </div>
            <div className='text-primary text-sm font-bold'>
              {ubicacionActual}
            </div>
            <div className='flex items-center gap-1 text-xs text-slate-500'>
              <ArrowRight className='h-3 w-3' />
              <span>En bandeja de entrada</span>
            </div>
          </div>
        </div>

        {/* 5. OBSERVACIONES INICIALES */}
        {tramite.observaciones && (
          <div className='rounded-md border border-amber-100 bg-amber-50/50 p-3'>
            <div className='mb-1 flex items-center gap-1.5 text-xs font-bold tracking-wide text-amber-700 uppercase'>
              <AlertOctagon className='h-3.5 w-3.5' />
              <span>Observaciones Iniciales</span>
            </div>
            <p className='text-sm text-amber-900/80'>{tramite.observaciones}</p>
          </div>
        )}

        {/* 6. FOOTER AUDITORÍA */}
        <div className='flex items-center justify-between border-t border-slate-50 pt-2 font-mono text-[10px] text-slate-400'>
          <div className='flex items-center gap-1.5'>
            <Clock className='h-3 w-3' />
            <span>
              Registrado:{' '}
              {formatDate(tramite.fechaIngreso, 'dd MMM yyyy, HH:mm')}
            </span>
          </div>
          {tramite.usuarioAsignado && (
            <span>
              Asignado a:{' '}
              <span className='font-semibold text-slate-500'>
                {tramite.usuarioAsignado.name}
              </span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
