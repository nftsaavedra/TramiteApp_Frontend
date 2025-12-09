// En: src/features/tramites/components/AnotacionItem.tsx
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { type Anotacion } from '@/features/tramites/types'

interface AnotacionItemProps {
  anotacion: Anotacion
}

export function AnotacionItem({ anotacion }: AnotacionItemProps) {
  const fechaCreacion = new Date(anotacion.createdAt)

  return (
    <div className='flex items-start gap-3'>
      <Avatar className='h-8 w-8 border'>
        <AvatarFallback>
          {anotacion.autor.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className='flex-1 space-y-1'>
        <div className='flex items-center justify-between'>
          <p className='text-sm font-medium'>{anotacion.autor.name}</p>
          <time
            className='text-muted-foreground text-xs'
            title={fechaCreacion.toLocaleString()}
          >
            {formatDistanceToNow(fechaCreacion, {
              addSuffix: true,
              locale: es,
            })}
          </time>
        </div>
        <p className='text-muted-foreground text-sm whitespace-pre-wrap'>
          {anotacion.contenido}
        </p>

        {anotacion.movimiento && (
          <div className='mt-2 flex items-center gap-2 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600'>
            <span className='font-semibold'>
              Ref: {anotacion.movimiento.tipoAccion}
            </span>
            <span>({anotacion.movimiento.oficinaOrigen.siglas})</span>
          </div>
        )}
      </div>
    </div>
  )
}
