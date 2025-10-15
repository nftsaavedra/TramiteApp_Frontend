// En: src/features/dashboard/components/ActividadReciente.tsx
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

// Datos de ejemplo para la actividad reciente
const activities = [
  {
    user: 'N. Saavedra',
    action: 'derivó',
    document: 'INF-001-2025',
    to: 'DGA',
    color: 'bg-blue-500',
  },
  {
    user: 'J. Pérez',
    action: 'archivó',
    document: 'SOL-045-2025',
    to: 'Archivo',
    color: 'bg-gray-500',
  },
  {
    user: 'M. García',
    action: 'creó',
    document: 'MEM-102-2025',
    to: 'Mesa de Partes',
    color: 'bg-green-500',
  },
  {
    user: 'A. Torres',
    action: 'recibió',
    document: 'INF-001-2025',
    to: 'DGA',
    color: 'bg-yellow-500',
  },
  {
    user: 'S. Rojas',
    action: 'cerró',
    document: 'RES-012-2025',
    to: 'Finalizado',
    color: 'bg-red-500',
  },
]

export function ActividadReciente() {
  return (
    <div className='space-y-6'>
      {activities.map((activity, index) => (
        <div key={index} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarFallback className={activity.color + ' text-white'}>
              {activity.user.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex-1 space-y-1'>
            <p className='text-sm leading-none font-medium'>
              <span className='font-bold'>{activity.user}</span>{' '}
              {activity.action} el documento{' '}
              <span className='text-primary'>{activity.document}</span>
            </p>
            <p className='text-muted-foreground text-sm'>
              Destino: {activity.to}
            </p>
          </div>
          <Badge variant='outline'>
            {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}
          </Badge>
        </div>
      ))}
    </div>
  )
}
