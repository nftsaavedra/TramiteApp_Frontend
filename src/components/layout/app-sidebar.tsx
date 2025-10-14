// En: src/components/layout/app-sidebar.tsx
// --- CORRECCIÓN DE ICONOS ---
import { LayoutDashboard, Files, Lock, Settings } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Logo } from '@/assets/logo'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { user } = useAuth()

  // Define la estructura de navegación dinámica con los iconos correctos
  const navGroups = [
    {
      title: 'Menú',
      links: [
        {
          to: '/',
          label: 'Dashboard',
          icon: <LayoutDashboard size={18} />,
        },
        {
          to: '/tramites',
          label: 'Trámites',
          icon: <Files size={18} />,
        },
      ],
    },
    // Grupo condicional para Administración
    ...(user?.role === 'ADMIN'
      ? [
          {
            title: 'Administración',
            links: [
              {
                to: '/admin/usuarios',
                label: 'Usuarios',
                icon: <Lock size={18} />,
              },
              {
                to: '/admin/oficinas',
                label: 'Oficinas',
                icon: <Lock size={18} />,
              },
              {
                to: '/admin/tipos-documento',
                label: 'Tipos de Documento',
                icon: <Lock size={18} />,
              },
            ],
          },
        ]
      : []),
    {
      title: 'Cuenta',
      links: [
        {
          to: '/settings',
          label: 'Configuración',
          icon: <Settings size={18} />,
        },
      ],
    },
  ]

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <div className='flex items-center gap-2'>
          <Logo className='h-6 w-6' />
          <span className='text-lg font-semibold'>TramiteApp</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroup key={group.title} title={group.title} links={group.links} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={{ name: user.name, email: user.email }} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
