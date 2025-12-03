// En: src/features/tramites/components/DetallesPrincipales.tsx
import {
  FileText,
  Building,
  Calendar,
  ChevronsRight,
  FileCheck,
  MapPin,
  AlertOctagon,
  ScrollText,
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

  return (
    <Card className='border-l-primary/80 h-full border-l-4 shadow-sm'>
      <CardHeader className='bg-muted/20 border-b pb-4'>
        <div className='flex flex-col justify-between gap-4 md:flex-row md:items-start'>
          <div className='space-y-1'>
            <CardTitle className='flex items-center gap-2 text-xl font-bold'>
              <FileText className='text-primary h-5 w-5' />
              Datos del Trámite
            </CardTitle>
            <p className='text-muted-foreground bg-background/50 w-fit rounded border px-2 py-0.5 font-mono text-sm'>
              {/* CAMBIO: Uso del nuevo nombre del campo */}
              {tramite.nombreDocumentoCompleto}
            </p>
          </div>

          <div className='flex items-center gap-2'>
            <Badge
              variant='outline'
              className='text-[10px] font-semibold tracking-wider uppercase'
            >
              Prioridad {tramite.prioridad}
            </Badge>
            <Badge variant={estadoVariant} className='px-3 py-1 font-medium'>
              {tramite.estado.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-6 pt-6'>
        {/* SECCIÓN 1: Alerta de Plazos (Si aplica) */}
        {tramite.plazo.estado !== 'NO_APLICA' && (
          <div
            className={`flex items-start gap-4 rounded-md border p-4 ${configPlazo.bgClass}`}
          >
            <div
              className={`bg-background/60 rounded-full p-2 ${configPlazo.textClass}`}
            >
              <IconoPlazo className='h-5 w-5' />
            </div>
            <div className='space-y-1'>
              <p className={`text-sm font-bold ${configPlazo.textClass}`}>
                Plazo {configPlazo.label}
              </p>
              {tramite.plazo.diasTranscurridos !== null && (
                <p className='text-foreground/80 text-xs'>
                  Han transcurrido{' '}
                  <strong>{tramite.plazo.diasTranscurridos}</strong> días
                  hábiles desde la última acción relevante.
                </p>
              )}
            </div>
          </div>
        )}

        {/* SECCIÓN 2: Datos Clave */}
        <div className='grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2'>
          <InfoItem
            icon={ScrollText}
            label='Asunto'
            value={
              <span className='text-foreground leading-snug font-medium'>
                {tramite.asunto}
              </span>
            }
          />

          <InfoItem
            icon={Building}
            label='Oficina Remitente'
            value={
              <div className='flex flex-col'>
                <span className='font-medium'>
                  {tramite.oficinaRemitente.nombre}
                </span>
                <span className='text-muted-foreground text-xs'>
                  ({tramite.oficinaRemitente.siglas})
                </span>
              </div>
            }
          />

          <InfoItem
            icon={MapPin}
            label='Ubicación Actual'
            value={
              <span className='text-primary flex items-center gap-1.5 font-bold'>
                {ubicacionActual}
              </span>
            }
          />

          <InfoItem
            icon={Calendar}
            label='Fecha Documento'
            value={formatDate(tramite.fechaDocumento, 'dd/MM/yyyy')}
          />

          <InfoItem
            icon={ChevronsRight}
            label='Fecha Ingreso'
            value={formatDate(tramite.fechaIngreso)}
          />

          <InfoItem
            icon={FileCheck}
            label='Tipo Documento'
            value={tramite.tipoDocumento.nombre}
          />
        </div>

        {/* SECCIÓN 3: Observaciones (Notas eliminadas) */}
        {tramite.observaciones && (
          <>
            <Separator />
            <div className='grid grid-cols-1 gap-4 text-sm'>
              <div className='space-y-1.5'>
                <div className='flex items-center gap-2 text-xs font-semibold text-amber-600 uppercase'>
                  <AlertOctagon className='h-3.5 w-3.5' />
                  Observaciones Iniciales
                </div>
                <p className='text-muted-foreground bg-muted/30 rounded-md border border-dashed p-2.5'>
                  {tramite.observaciones}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
