// En: src/features/tramites/components/MovimientoItem.tsx
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
  ArrowDown,
  ArrowRight,
  Archive,
  CheckCircle,
  FileUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { type Movimiento } from '@/features/tramites/types'

// Mapeo de acciones a iconos y colores para una mejor visualización
const actionConfig = {
  DERIVACION: { icon: ArrowRight, color: 'text-blue-500' },
  RESPUESTA: { icon: FileUp, color: 'text-green-500' },
  ARCHIVO: { icon: Archive, color: 'text-gray-500' },
  CIERRE: { icon: CheckCircle, color: 'text-red-500' },
  ASIGNACION: { icon: ArrowDown, color: 'text-purple-500' },
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
          <p className='text-sm font-medium'>
            <span className='font-bold'>{movimiento.usuarioCreador.name}</span>
            <span className='text-muted-foreground'> desde </span>
            <span className='font-bold'>{movimiento.oficinaOrigen.siglas}</span>
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
          <span> a </span>
          {movimiento.destinos.map((d) => (
            <span key={d.id} className='text-primary font-semibold'>
              {d.oficinaDestino.nombre}{' '}
            </span>
          ))}
        </div>
        {movimiento.notas && (
          <p className='pt-1 text-sm italic'>"{movimiento.notas}"</p>
        )}
      </div>
    </div>
  )
}
