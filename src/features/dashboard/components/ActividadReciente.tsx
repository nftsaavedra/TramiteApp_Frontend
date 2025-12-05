// En: src/features/dashboard/components/ActividadReciente.tsx
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { RecentActivity } from '../services/dashboard.service'

interface ActividadRecienteProps {
  data?: RecentActivity[]
}

export function ActividadReciente({ data = [] }: ActividadRecienteProps) {
  if (data.length === 0) {
    return (
      <div className='text-muted-foreground py-4 text-center'>
        No hay actividad reciente.
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {data.map((activity, index) => (
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
