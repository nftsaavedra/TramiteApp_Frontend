// En: src/features/tramites/components/DetallesPrincipales.tsx
import {
  FileText,
  Building,
  Calendar,
  FileCheck,
  MapPin,
  AlertOctagon,
  ScrollText,
  Clock,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { type TramiteCompleto } from '@/features/tramites/types'
import {
  obtenerUbicacionActual,
  obtenerConfiguracionPlazo,
} from '../utils/tramite-helpers'
import { InfoItem } from './InfoItem'

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
      {/* HEADER: Título y Estados */}
      <CardHeader className='bg-muted/30 border-b pt-4 pb-3'>
        <div className='flex flex-col justify-between md:flex-row md:items-start'>
          <div className='flex-1 space-y-1'>
            <div className='flex items-center space-x-2'>
              <Badge
                variant='outline'
                className={`text-xs font-bold tracking-wider uppercase ${prioridadColor}`}
              >
                Prioridad {tramite.prioridad}
              </Badge>
              <Badge
                variant={estadoVariant}
                className='px-2.5 py-0.5 text-xs font-bold'
              >
                {tramite.estado.replace('_', ' ')}
              </Badge>
            </div>
            <CardTitle className='flex items-start space-x-2 text-lg leading-tight font-bold text-balance'>
              <FileText className='text-primary mt-1 h-5 w-5 shrink-0' />
              <span>{tramite.nombreDocumentoCompleto}</span>
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4 pt-4'>
        {/* SECCIÓN 1: Alerta de Plazos (Destacado) */}
        {tramite.plazo.estado !== 'NO_APLICA' && (
          <div
            className={`flex items-start space-x-3 rounded-lg border p-3 shadow-sm ${configPlazo.bgClass}`}
          >
            <div
              className={`bg-background/80 rounded-full p-1.5 shadow-sm ${configPlazo.textClass}`}
            >
              <IconoPlazo className='h-3.5 w-3.5' />
            </div>
            <div className='space-y-0.5'>
              <p className={`text-sm font-bold ${configPlazo.textClass}`}>
                Estado del Plazo: {configPlazo.label}
              </p>
              {tramite.plazo.diasTranscurridos !== null && (
                <p className='text-foreground/80 text-xs leading-relaxed'>
                  Han transcurrido{' '}
                  <strong className='font-mono text-xs'>
                    {tramite.plazo.diasTranscurridos}
                  </strong>{' '}
                  días hábiles desde la última acción relevante.
                </p>
              )}
            </div>
          </div>
        )}

        {/* SECCIÓN 2: ASUNTO (Full Width - Protagonismo) */}
        <div className='space-y-1.5'>
          <div className='text-muted-foreground flex items-center space-x-2'>
            <ScrollText className='h-4 w-4' />
            <h3 className='text-xs font-bold tracking-wide uppercase'>
              Asunto del Trámite
            </h3>
          </div>
          <div className='bg-muted/10 border-border/50 rounded-md border p-3'>
            <p className='text-foreground text-sm leading-relaxed font-medium text-balance'>
              {tramite.asunto}
            </p>
          </div>
        </div>

        <Separator />

        {/* SECCIÓN 3: Datos de Trazabilidad (Vertical Stack para Sidebar) */}
        <div className='flex flex-col space-y-4'>
          {/* Contexto */}
          <div className='space-y-4'>
            <InfoItem
              icon={FileCheck}
              label='Tipo Documento'
              value={tramite.tipoDocumento.nombre}
            />
            <InfoItem
              icon={Building}
              label='Oficina Remitente'
              value={
                <div className='flex flex-col'>
                  <span className='font-medium'>
                    {tramite.oficinaRemitente.nombre}
                  </span>
                  <span className='text-muted-foreground text-[10px]'>
                    {tramite.oficinaRemitente.siglas}
                  </span>
                </div>
              }
            />
          </div>

          {/* Ubicación */}
          <div className='space-y-4'>
            <InfoItem
              icon={MapPin}
              label='Ubicación Actual'
              value={
                <span className='text-primary flex items-center space-x-1 font-bold'>
                  {ubicacionActual}
                </span>
              }
            />
          </div>

          {/* Fechas */}
          <div className='space-y-4'>
            <InfoItem
              icon={Calendar}
              label='Fecha Documento'
              value={formatDate(tramite.fechaRecepcion, 'dd MMM yyyy')}
            />
            <InfoItem
              icon={Clock}
              label='Fecha Ingreso'
              value={formatDate(tramite.fechaIngreso, 'dd MMM yyyy, HH:mm')}
            />
          </div>
        </div>

        {/* SECCIÓN 4: Observaciones (Si existen) */}
        {tramite.observaciones && (
          <>
            <Separator className='my-1' />
            <div className='bg-muted/30 rounded-md border border-dashed p-3'>
              <div className='mb-2 flex items-center space-x-2 text-xs font-bold tracking-wide text-amber-600 uppercase'>
                <AlertOctagon className='h-4 w-4' />
                <span>Observaciones Iniciales</span>
              </div>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {tramite.observaciones}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
