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

// 1. Ruta de importación del Logo corregida

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { user } = useAuth()

  // Define la estructura de navegación con las propiedades correctas
  const navGroups = [
    {
      title: 'Menú',
      items: [
        {
          url: '/',
          title: 'Inicio', // <-- 2. CORREGIDO: de 'label' a 'title'
          icon: LayoutDashboard,
        },
        {
          url: '/tramites',
          title: 'Trámites', // <-- 2. CORREGIDO: de 'label' a 'title'
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
                title: 'Usuarios', // <-- 2. CORREGIDO: de 'label' a 'title'
                icon: Lock,
              },
              {
                url: '/admin/oficinas',
                title: 'Oficinas', // <-- 2. CORREGIDO: de 'label' a 'title'
                icon: Lock,
              },
              {
                url: '/admin/tipos-documento',
                title: 'Tipos de Documento', // <-- 2. CORREGIDO: de 'label' a 'title'
                icon: Lock,
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
          title: 'Configuración', // <-- 2. CORREGIDO: de 'label' a 'title'
          icon: Settings,
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
        {/* 3. Se mantiene la propiedad 'avatar' con un valor temporal */}
        {user && (
          <NavUser user={{ name: user.name, email: user.email, avatar: '' }} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
