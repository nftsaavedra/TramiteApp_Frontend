// En: src/features/tramites/components/InfoItem.tsx
import { type LucideIcon } from 'lucide-react'

interface InfoItemProps {
  icon: LucideIcon
  label: string
  value: React.ReactNode
}

export function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className='flex items-start gap-3'>
      <Icon className='text-muted-foreground mt-0.5 h-5 w-5' />
      <div className='flex flex-col space-y-0.5'>
        <span className='text-muted-foreground text-sm font-medium'>
          {label}
        </span>
        <span className='text-foreground text-sm font-bold'>{value}</span>
      </div>
    </div>
  )
}
