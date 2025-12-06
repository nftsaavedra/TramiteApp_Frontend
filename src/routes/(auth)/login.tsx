import { createFileRoute } from '@tanstack/react-router'
import { Logo } from '@/assets/logo'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UserAuthForm } from '@/features/auth/components/UserAuthForm'

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='flex h-full w-full items-center justify-center p-4 lg:p-8'>
        <Card className='w-full max-w-[450px] border-2 shadow-xl dark:border-white/20 dark:shadow-white/5'>
          <CardHeader className='space-y-4'>
            <div className='flex flex-col items-center justify-center gap-2 text-center'>
              <div className='mb-6 space-y-2 text-center'>
                <p className='text-muted-foreground text-sm'></p>
              </div>
              <div className='space-y-1'>
                <CardTitle className='text-3xl font-bold tracking-tight'>
                  Bienvenido
                </CardTitle>
                <CardDescription className='text-base'>
                  Ingresa tus credenciales para acceder al sistema
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='pt-4'>
            <UserAuthForm />
            <div className='text-muted-foreground mt-4 text-center text-xs'>
              <p>
                Al continuar, aceptas nuestros{' '}
                <a
                  href='#'
                  className='hover:text-primary underline underline-offset-4'
                >
                  Términos de servicio
                </a>{' '}
                y{' '}
                <a
                  href='#'
                  className='hover:text-primary underline underline-offset-4'
                >
                  Política de privacidad
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='relative hidden h-full overflow-hidden border-l bg-zinc-900 p-10 text-white lg:flex lg:flex-col lg:justify-between dark:bg-zinc-950'>
        <div className='absolute inset-0 bg-stone-900' />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <Logo className='h-8 w-8' />
          <CardTitle className='text-3xl font-bold tracking-tight'>
            {import.meta.env.VITE_APP_NAME || 'Tramite App'}
          </CardTitle>
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;Una plataforma diseñada para simplificar y agilizar cada
              paso de tus procesos administrativos.&rdquo;
            </p>
            <footer className='text-sm'>@VPIN-UNF</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
