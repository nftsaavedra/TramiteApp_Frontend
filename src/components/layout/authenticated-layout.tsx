// En: src/components/layout/authenticated-layout.tsx
import { Outlet, Navigate } from '@tanstack/react-router'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
// --- INICIO: Imports movidos desde el Dashboard ---
import { ConfigDrawer } from '@/components/config-drawer'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { SkipToMain } from '@/components/skip-to-main'
import { ThemeSwitch } from '@/components/theme-switch'

// --- FIN: Imports movidos ---

// Datos para la navegación superior (podemos adaptarlos más adelante)
const topNav = [
  {
    title: 'General',
    href: '/',
    isActive: true,
  },
]

export function AuthenticatedLayout() {
  const { isAuthenticated } = useAuth()
  const defaultOpen = getCookie('sidebar_state') !== 'false'

  if (!isAuthenticated) {
    return <Navigate to='/login' search={{ redirect: location.href }} />
  }

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
            {/* ===== INICIO: Header movido aquí ===== */}
            <Header>
              <TopNav links={topNav} />
              <div className='ms-auto flex items-center space-x-4'>
                <Search />
                <ThemeSwitch />
                <ConfigDrawer />
                <ProfileDropdown />
              </div>
            </Header>
            {/* ===== FIN: Header movido aquí ===== */}

            {/* El Outlet renderizará la página actual (Dashboard, Trámites, etc.) */}
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}
