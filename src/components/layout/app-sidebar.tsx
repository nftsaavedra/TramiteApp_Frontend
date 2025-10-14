// En: src/components/layout/app-sidebar.tsx
import { LayoutDashboard, Files, Lock, Settings } from 'lucide-react'
import { Logo } from '@/assets/logo'
import { useAuth } from '@/context/AuthContext'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

// <- 1. Ruta de importación del Logo corregida

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { user } = useAuth()

  // Define la estructura de navegación dinámica
  const navGroups = [
    {
      title: 'Menú',
      // 2. La propiedad ahora se llama 'items' en lugar de 'links'
      items: [
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
            items: [
              // <-- 2. Corregido a 'items'
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
      items: [
        // <-- 2. Corregido a 'items'
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
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* 3. Añadimos la propiedad 'avatar' requerida con un valor temporal */}
        {user && (
          <NavUser user={{ name: user.name, email: user.email, avatar: '' }} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
