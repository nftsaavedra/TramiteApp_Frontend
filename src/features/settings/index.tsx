import { Outlet } from '@tanstack/react-router'
import { Palette, Lock, UserCog } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { SidebarNav } from './components/sidebar-nav'

const sidebarNavItems = [
  {
    title: 'Perfil',
    href: '/settings',
    icon: <UserCog size={18} />,
  },
  {
    title: 'Seguridad',
    href: '/settings/account',
    icon: <Lock size={18} />,
  },
  {
    title: 'Apariencia',
    href: '/settings/appearance',
    icon: <Palette size={18} />,
  },
]

export function Settings() {
  return (
    <Main fluid className='w-full'>
      <div className='w-full space-y-6 p-6'>
        {/* Header con contexto */}
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Configuración</h1>
          <p className='text-muted-foreground'>
            Administra tu configuración de cuenta y preferencias.
          </p>
        </div>

        {/* Layout de dos columnas: Sidebar + Contenido */}
        <div className='flex flex-col gap-6 lg:flex-row'>
          {/* Sidebar de navegación */}
          <aside className='lg:w-64 flex-shrink-0'>
            <SidebarNav items={sidebarNavItems} />
          </aside>

          {/* Área de contenido principal */}
          <div className='flex-1'>
            <Outlet />
          </div>
        </div>
      </div>
    </Main>
  )
}
