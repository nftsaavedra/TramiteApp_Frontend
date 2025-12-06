import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from '@tanstack/react-router'
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido.'),
  password: z.string().min(1, 'La contraseña es requerida.'),
})

export function UserAuthForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [authError, setAuthError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setAuthError(null)
    try {
      const response = await api.post('/auth/login', values)
      const { access_token } = response.data
      if (access_token) {
        login(access_token)
        navigate({ to: '/' })
      }
    } catch (error) {
      console.error('Error de autenticación:', error)
      setAuthError('Credenciales incorrectas. Verifique sus datos.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {authError && (
          <Alert
            variant='destructive'
            className='animate-in fade-in-50 slide-in-from-top-2'
          >
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error de acceso</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico</FormLabel>
                <FormControl>
                  <Input
                    placeholder='nombre@ejemplo.com'
                    className='h-11'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center justify-between'>
                  <FormLabel>Contraseña</FormLabel>
                  <Link
                    to='/forgot-password'
                    className='text-primary text-xs font-medium underline-offset-4 hover:underline'
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      className='h-11 pr-10'
                      {...field}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute top-0 right-0 h-11 w-11 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                      <span className='sr-only'>
                        {showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type='submit'
          className='h-11 w-full font-medium'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Ingresando...
            </>
          ) : (
            'Ingresar al sistema'
          )}
        </Button>
      </form>
    </Form>
  )
}
