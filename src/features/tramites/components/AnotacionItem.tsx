// En: src/features/tramites/components/AnotacionItem.tsx
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { type Anotacion } from '@/features/tramites/types'

interface AnotacionItemProps {
  anotacion: Anotacion
  minimal?: boolean
}

export function AnotacionItem({
  anotacion,
  minimal = false,
}: AnotacionItemProps) {
  const fechaCreacion = new Date(anotacion.createdAt)

  if (minimal) {
    return (
      <div className='group flex gap-3'>
        <Avatar className='mt-0.5 h-6 w-6'>
          <AvatarFallback className='bg-slate-100 text-[10px] text-slate-600'>
            {anotacion.autor.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='flex-1'>
          <div className='mb-0.5 flex items-center gap-2'>
            <span className='text-xs font-semibold text-slate-700'>
              {anotacion.autor.name}
            </span>
            <time className='text-[10px] text-slate-400'>
              {formatDistanceToNow(fechaCreacion, {
                addSuffix: true,
                locale: es,
              })}
            </time>
          </div>
          <p className='rounded-md bg-slate-50/50 p-2 text-sm leading-relaxed text-slate-600 transition-colors group-hover:bg-slate-50'>
            {anotacion.contenido}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='bg-card text-card-foreground flex items-start gap-3 rounded-lg border p-3 shadow-sm'>
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
        <p className='text-muted-foreground mt-1 text-sm whitespace-pre-wrap'>
          {anotacion.contenido}
        </p>

        {anotacion.movimiento && (
          <div className='mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600'>
            <span>Ref: {anotacion.movimiento.tipoAccion}</span>
            <span className='opacity-50'>•</span>
            <span>{anotacion.movimiento.oficinaOrigen.siglas}</span>
          </div>
        )}
      </div>
    </div>
  )
}
