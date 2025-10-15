// En: src/components/profile-dropdown.tsx
import { Link } from '@tanstack/react-router'
import { LogOut, Settings, User } from 'lucide-react'
// 1. Iconos actualizados
import { useAuth } from '@/context/AuthContext'
// 2. Importa nuestro hook de autenticación
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ProfileDropdown() {
  const { user, logout } = useAuth() // 3. Obtiene el usuario y la función logout

  // Si por alguna razón el usuario no está disponible, no renderiza nada.
  if (!user) {
    return null
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            {/* 4. Muestra la inicial del usuario real como fallback */}
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col gap-1.5'>
            {/* 5. Muestra el nombre y email del usuario real */}
            <p className='text-sm leading-none font-medium'>{user.name}</p>
            <p className='text-muted-foreground text-xs leading-none'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* 6. Menú de opciones simplificado y relevante */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings/account'>
              <User className='mr-2 h-4 w-4' />
              <span>Mi Cuenta</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              <Settings className='mr-2 h-4 w-4' />
              <span>Configuración</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {/* 7. El onClick ahora llama directamente a la función logout */}
        <DropdownMenuItem onClick={logout}>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    // 8. El SignOutDialog y su lógica han sido eliminados.
  )
}
