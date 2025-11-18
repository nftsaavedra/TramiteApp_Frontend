// En: src/routes/_authenticated/route.tsx
import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  component: AuthGuard,
})

function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuth()

  // 1. PANTALLA DE CARGA (Splash Screen)
  // Bloquea el renderizado mientras se rehidrata la sesión.
  // Esto evita que el usuario sea redirigido al login por error.
  if (isLoading) {
    return (
      <div className='bg-background flex h-screen w-full items-center justify-center'>
        <div className='flex flex-col items-center gap-4'>
          {/* Spinner usando Skeleton de shadcn/ui */}
          <Skeleton className='h-16 w-16 rounded-full' />
          <div className='space-y-2 text-center'>
            <Skeleton className='h-4 w-[200px]' />
            <Skeleton className='h-4 w-[150px]' />
          </div>
          <p className='text-muted-foreground mt-4 animate-pulse text-sm'>
            Verificando sesión...
          </p>
        </div>
      </div>
    )
  }

  // 2. VALIDACIÓN DE SEGURIDAD
  // Solo cuando isLoading es false, confiamos en isAuthenticated.
  if (!isAuthenticated) {
    return <Navigate to='/login' />
  }

  // 3. ACCESO CONCEDIDO
  // Renderizamos el layout original que ya tenías.
  return <AuthenticatedLayout />
}
