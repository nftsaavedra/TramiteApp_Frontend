// En: src/components/layout/app-sidebar.tsx
import { LayoutDashboard, Files, Lock, Settings } from 'lucide-react'
import { Logo } from '@/assets/logo'
// 1. Ruta de importación del Logo correcta
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

  // Define la estructura de navegación con las propiedades CORRECTAS: 'url' y 'title'
  const navGroups = [
    {
      title: 'Menú',
      items: [
        {
          url: '/', // <-- 2. CORRECCIÓN FINAL: de 'to' a 'url'
          title: 'Inicio',
          icon: LayoutDashboard,
        },
        {
          url: '/tramites', // <-- 2. CORRECCIÓN FINAL: de 'to' a 'url'
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
                url: '/admin/usuarios', // <-- 2. CORRECCIÓN FINAL: de 'to' a 'url'
                title: 'Usuarios',
                icon: Lock,
              },
              {
                url: '/admin/oficinas', // <-- 2. CORRECCIÓN FINAL: de 'to' a 'url'
                title: 'Oficinas',
                icon: Lock,
              },
              {
                url: '/admin/tipos-documento', // <-- 2. CORRECCIÓN FINAL: de 'to' a 'url'
                title: 'Tipos de Documento',
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
          url: '/settings', // <-- 2. CORRECCIÓN FINAL: de 'to' a 'url'
          title: 'Configuración',
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
          <span className='text-lg font-semibold'>
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
        {/* 3. Se mantiene la propiedad 'avatar' para cumplir con el tipo */}
        {user && (
          <NavUser user={{ name: user.name, email: user.email, avatar: '' }} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
