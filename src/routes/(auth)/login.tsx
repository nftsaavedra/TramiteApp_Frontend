import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import { NewsFeed } from '@/features/auth/components/NewsFeed'
import { UserAuthForm } from '@/features/auth/components/UserAuthForm'
import { Building2, Shield, Zap } from 'lucide-react'

export const Route = createFileRoute('/(auth)/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className='relative min-h-svh container grid items-center justify-center p-0 lg:max-w-none lg:grid-cols-2'>
      {/* Panel izquierdo - Formulario de login */}
      <div className='flex w-full items-center justify-center p-[clamp(1rem,0.75rem+1.25vw,2rem)] lg:py-[clamp(1.5rem,1.25rem+1.25vw,3rem)]'>
        <div className='w-full max-w-[clamp(26rem,24rem+10vw,30rem)] space-y-[clamp(1.5rem,1.25rem+1.25vw,3rem)]'>
          {/* Header móvil */}
          <div className='flex flex-col items-center justify-center space-y-4 text-center lg:hidden'>
            <div className='flex items-center gap-2'>
              <Building2 className='h-10 w-10 text-primary' />
              <h1 className='text-2xl font-bold'>Trámite App</h1>
            </div>
            <p className='text-muted-foreground text-sm'>
              Sistema de Gestión Documental
            </p>
          </div>

          {/* Card de login */}
          <Card className='border-2 shadow-2xl dark:border-white/20 dark:shadow-white/10'>
            <CardHeader className='space-y-4 pb-6'>
              <div className='hidden flex-col items-center justify-center gap-2 text-center lg:flex'>
                <div className='mb-2 flex items-center gap-3'>
                  <Building2 className='h-12 w-12 text-primary' />
                  <h1 className='text-4xl font-bold tracking-tight'>
                    Bienvenido
                  </h1>
                </div>
              </div>
              <CardDescription className='text-base hidden lg:block'>
                Ingresa tus credenciales para acceder al sistema de gestión
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <UserAuthForm />
              
              {/* Características destacadas */}
              <div className='grid gap-3 pt-4 sm:grid-cols-3'>
                <div className='flex flex-col items-center justify-center space-y-2 rounded-lg border bg-muted/50 p-3 text-center'>
                  <Shield className='h-6 w-6 text-primary' />
                  <span className='text-xs font-medium'>Seguro</span>
                </div>
                <div className='flex flex-col items-center justify-center space-y-2 rounded-lg border bg-muted/50 p-3 text-center'>
                  <Zap className='h-6 w-6 text-primary' />
                  <span className='text-xs font-medium'>Rápido</span>
                </div>
                <div className='flex flex-col items-center justify-center space-y-2 rounded-lg border bg-muted/50 p-3 text-center'>
                  <Building2 className='h-6 w-6 text-primary' />
                  <span className='text-xs font-medium'>Confiable</span>
                </div>
              </div>

              <div className='text-muted-foreground mt-6 text-center text-xs'>
                <p>
                  Al continuar, aceptas nuestros{' '}
                  <a
                    href='#'
                    className='hover:text-primary underline underline-offset-4 transition-colors'
                  >
                    Términos de servicio
                  </a>{' '}
                  y{' '}
                  <a
                    href='#'
                    className='hover:text-primary underline underline-offset-4 transition-colors'
                  >
                    Política de privacidad
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Panel derecho - Visual/Marketing */}
      <div className='relative hidden h-full flex-col items-center justify-center overflow-hidden border-l bg-gradient-to-br from-zinc-900 via-stone-900 to-zinc-950 text-white lg:flex'>
        {/* Background pattern */}
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]' />
        
        {/* Gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent' />

        {/* Contenido */}
        <div className='relative z-10 flex w-full max-w-[clamp(32rem,28rem+20vw,42rem)] flex-col items-center justify-center p-8 text-center'>
          <NewsFeed />
          
        </div>

        {/* Decorative elements */}
        <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900 to-transparent' />
      </div>
    </div>
  )
}
