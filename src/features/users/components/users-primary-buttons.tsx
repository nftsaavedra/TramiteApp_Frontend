// En: src/features/users/components/users-primary-buttons.tsx

import { UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
// La importación de 'useUsers' ha sido eliminada.

type UsersPrimaryButtonsProps = {
  onCreate: () => void
}

export function UsersPrimaryButtons({ onCreate }: UsersPrimaryButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button className="space-x-2" onClick={onCreate}>
        <UserPlus size={18} />
        <span>Añadir Usuario</span>
      </Button>
    </div>
  )
}