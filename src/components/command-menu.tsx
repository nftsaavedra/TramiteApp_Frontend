// En: src/components/command-menu.tsx
import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  ChevronRight,
  Files,
  LayoutDashboard,
  Laptop,
  Lock,
  Moon,
  Settings,
  Sun,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
// 1. Importa el hook de autenticación
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
// import { sidebarData } from './layout/data/sidebar-data' // 2. Importación obsoleta eliminada
import { ScrollArea } from './ui/scroll-area'

export function CommandMenu() {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()
  const { user } = useAuth() // 3. Obtiene el usuario para la lógica de roles

  // 4. Se reconstruye la misma estructura de navegación que en AppSidebar (Single Source of Truth)
  const navGroups = [
    {
      title: 'Menú',
      items: [
        { url: '/', title: 'Inicio', icon: LayoutDashboard },
        { url: '/tramites', title: 'Trámites', icon: Files },
      ],
    },
    ...(user?.role === 'ADMIN'
      ? [
          {
            title: 'Administración',
            items: [
              { url: '/admin/usuarios', title: 'Usuarios', icon: Lock },
              { url: '/admin/oficinas', title: 'Oficinas', icon: Lock },
              {
                url: '/admin/tipos-documento',
                title: 'Tipos de Documento',
                icon: Lock,
              },
            ],
          },
        ]
      : []),
    {
      title: 'Cuenta',
      items: [{ url: '/settings', title: 'Configuración', icon: Settings }],
    },
  ]

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Escribe un comando o busca...' />
      <CommandList>
        <ScrollArea type='hover' className='h-72 pe-1'>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>

          {/* 5. Se itera sobre la nueva estructura de datos dinámica */}
          {navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem) => (
                <CommandItem
                  key={navItem.url}
                  value={navItem.title}
                  onSelect={() => {
                    runCommand(() => navigate({ to: navItem.url }))
                  }}
                >
                  <navItem.icon className='mr-2 h-4 w-4' />
                  <span>{navItem.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}

          <CommandSeparator />
          <CommandGroup heading='Tema'>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <Sun className='mr-2 h-4 w-4' />
              <span>Claro</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <Moon className='mr-2 h-4 w-4' />
              <span>Oscuro</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <Laptop className='mr-2 h-4 w-4' />
              <span>Sistema</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
