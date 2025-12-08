// En: src/features/dashboard/components/StatCard.tsx
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  description?: string
  className?: string // Prop para estilos personalizados
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <div className='bg-background/20 rounded-full p-2'>
          <Icon className='h-4 w-4 text-inherit' />
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {description && (
          <p className='text-muted-foreground/80 text-xs'>{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
