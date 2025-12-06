// En: src/routes/(auth)/login.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Logo } from '@/assets/logo'
import { UserAuthForm } from '@/features/auth/components/UserAuthForm'

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
})

import { NewsFeed } from '@/features/auth/components/NewsFeed'

function LoginPage() {
  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='lg:p-8'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
          <div className='mb-4 flex flex-col items-center justify-center gap-2'>
            <div className='flex items-center gap-2'>
              <Logo className='h-8 w-8' />
              <h1 className='text-xl font-medium'>
                {import.meta.env.VITE_APP_NAME}
              </h1>
            </div>
            <p className='text-muted-foreground text-sm'>
              {import.meta.env.VITE_APP_DESCRIPTION}
            </p>
          </div>
        </div>
        <div className='mx-auto flex w-full max-w-sm flex-col justify-center space-y-2'>
          <div className='flex flex-col space-y-2 text-start'>
            <h2 className='text-lg font-semibold tracking-tight'>
              Iniciar Sesión
            </h2>
            <p className='text-muted-foreground text-sm'>
              Ingresa tu correo y contraseña para acceder a tu cuenta
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>

      <div className='relative hidden h-full overflow-hidden border-l bg-muted/40 lg:block'>
        <NewsFeed />
      </div>
    </div>
  )
}
