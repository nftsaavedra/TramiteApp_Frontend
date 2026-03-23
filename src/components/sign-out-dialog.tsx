import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { ConfirmDialog } from '@/components/confirm-dialog'

interface SignOutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleSignOut = () => {
    logout()
    navigate({
      to: '/login',
      replace: true,
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Cerrar sesión'
      desc='¿Estás seguro de que deseas cerrar sesión? Necesitarás iniciar sesión nuevamente para acceder a tu cuenta.'
      confirmText='Cerrar sesión'
      handleConfirm={handleSignOut}
      className='sm:max-w-[clamp(24rem,20rem+20vw,30rem)]'
    />
  )
}
