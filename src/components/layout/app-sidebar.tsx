// En: src/components/layout/app-sidebar.tsx
import { LayoutDashboard, Files, Building2, Users, Building, FileText, UserCog } from 'lucide-react'
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

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { user } = useAuth()

  // Define la estructura de navegación
  const navGroups = [
    {
      title: 'Menú',
      items: [
        {
          url: '/',
          title: 'Inicio',
          icon: LayoutDashboard,
        },
        {
          url: '/tramites',
          title: 'Trámites',
          icon: Files,
        },
      ],
    },
    // Grupo condicional para Administración
    ...(user?.role === 'ADMIN'
      ? [
          {
            title: 'Administración',
            items: [
              {
                url: '/admin/usuarios',
                title: 'Usuarios',
                icon: Users,
              },
              {
                url: '/admin/oficinas',
                title: 'Oficinas',
                icon: Building,
              },
              {
                url: '/admin/tipos-documento',
                title: 'Tipos de Documento',
                icon: FileText,
              },
              {
                url: '/admin/configuracion',
                title: 'Configuración del Sistema',
                icon: Building2,
              },
            ],
          },
        ]
      : []),
    {
      title: 'Cuenta',
      items: [
        {
          url: '/settings',
          title: 'Preferencias',
          icon: UserCog,
        },
      ],
    },
  ]

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-2 py-4'>
          <Logo className='h-6 w-6 flex-shrink-0' />
          <span className='text-lg font-semibold line-clamp-1'>
            {import.meta.env.VITE_APP_NAME}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser user={{ name: user.name, email: user.email, avatar: '' }} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
