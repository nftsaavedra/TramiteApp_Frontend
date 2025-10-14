// En: src/components/layout/authenticated-layout.tsx
import { Outlet, Navigate } from '@tanstack/react-router'
// Importamos nuestro hook
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { SkipToMain } from '@/components/skip-to-main'

export function AuthenticatedLayout() {
  const { isAuthenticated } = useAuth() // Usamos el hook para verificar la autenticación
  const defaultOpen = getCookie('sidebar_state') !== 'false'

  // --- LÓGICA DE SEGURIDAD ---
  // Si el usuario no está autenticado, redirigimos a la página de login.
  if (!isAuthenticated) {
    return <Navigate to='/login' search={{ redirect: location.href }} />
  }
  // --- FIN DE LA LÓGICA DE SEGURIDAD ---

  // Si está autenticado, renderizamos el layout normal.
  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <SidebarInset
            className={cn(
              '@container/content',
              'has-[[data-layout=fixed]]:h-svh',
              'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]'
            )}
          >
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}
