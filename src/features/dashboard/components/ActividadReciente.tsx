import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { FileText, Send, CheckCircle, Archive, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RecentActivity } from '../services/dashboard.service'

interface ActividadRecienteProps {
  data?: RecentActivity[]
}

const getActivityConfig = (action: string) => {
  const lowerAction = action.toLowerCase()
  if (lowerAction.includes('creó') || lowerAction.includes('registró')) {
    return {
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      badge: 'default',
    }
  }
  if (lowerAction.includes('derivó') || lowerAction.includes('movimiento')) {
    return {
      icon: Send,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      badge: 'secondary',
    }
  }
  if (lowerAction.includes('finalizó') || lowerAction.includes('aprobó')) {
    return {
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      badge: 'outline', // tailored to look distinct often
    }
  }
  if (lowerAction.includes('archivó')) {
    return {
      icon: Archive,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      badge: 'secondary',
    }
  }
  return {
    icon: AlertCircle,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    badge: 'outline',
  }
}

export function ActividadReciente({ data = [] }: ActividadRecienteProps) {
  if (data.length === 0) {
    return (
      <div className='text-muted-foreground py-8 text-center text-sm'>
        No hay actividad reciente para mostrar.
      </div>
    )
  }

  return (
    <ScrollArea className='h-[400px] pr-4'>
      <div className='space-y-3 pl-1'>
        {data.map((activity, index) => {
          const config = getActivityConfig(activity.action)
          const Icon = config.icon

          return (
            <div
              key={index}
              className='hover:bg-muted/40 group flex items-start gap-3 rounded-lg border p-3 transition-colors'
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${config.bgColor}`}
              >
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <div className='flex min-w-0 flex-1 flex-col gap-1'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='truncate text-sm font-semibold'>
                    {activity.user}
                  </span>
                  <span className='text-muted-foreground shrink-0 text-xs'>
                    {activity.date
                      ? formatDistanceToNow(new Date(activity.date), {
                          addSuffix: true,
                          locale: es,
                        })
                      : 'Hace un momento'}
                  </span>
                </div>

                <p className='text-muted-foreground line-clamp-2 text-xs'>
                  <span className={config.color}>{activity.action}</span> el
                  documento{' '}
                  <span className='text-foreground font-medium'>
                    {activity.document}
                  </span>
                </p>

                <div className='mt-1 flex items-center justify-between'>
                  <div className='flex items-center gap-1.5'>
                    <Badge
                      variant='secondary'
                      className='h-5 px-1.5 text-[10px] font-normal'
                    >
                      {activity.to}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
