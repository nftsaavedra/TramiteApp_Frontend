// En: src/features/tramites/components/MovimientoItem.tsx
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowRight, Inbox } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { type Movimiento } from '@/features/tramites/types'

// Mapeo de acciones a iconos y colores para una mejor visualización
const actionConfig = {
  ENVIO: { icon: ArrowRight, color: 'text-blue-500' },
  RECEPCION: { icon: Inbox, color: 'text-green-500' },
}

interface MovimientoItemProps {
  movimiento: Movimiento
}

export function MovimientoItem({ movimiento }: MovimientoItemProps) {
  const { icon: Icon, color } = actionConfig[movimiento.tipoAccion] || {
    icon: ArrowRight,
    color: 'text-gray-500',
  }
  const fechaCreacion = new Date(movimiento.createdAt)

  return (
    <div className='flex gap-4'>
      {/* Icono de la Acción */}
      <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full'>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>

      {/* Contenido del Movimiento */}
      <div className='flex-1 space-y-1'>
        <div className='flex items-center justify-between'>
          <p className='text-foreground text-sm'>
            <span className='mb-0.5 block font-bold'>
              {movimiento.nombreDocumentoCompleto || 'Sin Documento'}
            </span>
            {/* <span className='font-bold'> {movimiento.usuarioCreador.name}</span>
            <span className='text-muted-foreground'> desde </span> */}
            {/* <span className='font-bold'>{movimiento.oficinaOrigen.siglas}</span> */}
            {movimiento.fechaRecepcion && (
              <>
                <span className='text-muted-foreground'> Fecha: </span>
                <span className='text-foreground font-semibold'>
                  {format(movimiento.fechaRecepcion, "dd 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </span>
              </>
            )}
          </p>
          <time
            className='text-muted-foreground text-xs'
            title={format(fechaCreacion, "dd 'de' MMMM, yyyy 'a las' HH:mm", {
              locale: es,
            })}
          >
            {formatDistanceToNow(fechaCreacion, {
              addSuffix: true,
              locale: es,
            })}
          </time>
        </div>
        <div className='text-muted-foreground text-sm'>
          <Badge variant='secondary'>{movimiento.tipoAccion}</Badge>
          {movimiento.oficinaDestino && (
            <>
              <span> a </span>
              <span className='text-primary font-semibold'>
                {movimiento.oficinaDestino.nombre}
              </span>
            </>
          )}
        </div>
        {movimiento.notas && (
          <p className='pt-1 text-sm italic'>"{movimiento.notas}"</p>
        )}
      </div>
    </div>
  )
}
