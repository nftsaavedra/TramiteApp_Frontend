import { useState, useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from '@tanstack/react-router'
import { AlertCircle, Eye, EyeOff, Loader2, Wifi, Mail, Lock } from 'lucide-react'
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
import { ConnectionStatusIndicator } from '@/components/connection-status-indicator'
import { useWebSocketStatus } from '@/hooks/use-websocket-status'

const formSchema = z.object({
  email: z.string().email('Ingresa un correo electrónico válido.'),
  password: z.string().min(1, 'La contraseña es requerida.'),
})

export function UserAuthForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [authError, setAuthError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  
  // Hook de estado de conexión WebSocket
  const { status, isConnected } = useWebSocketStatus({
    autoReconnect: true,
    reconnectInterval: 3000,
    maxReconnectAttempts: 10,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  })

  // Limpiar formulario cuando se reconecta
  useEffect(() => {
    if (isConnected && authError) {
      setAuthError(null)
      form.reset()
    }
  }, [isConnected])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setAuthError(null)
    try {
      const response = await api.post('/api/auth/login', values)
      const { access_token, message } = response.data
      if (access_token) {
        login(access_token)
        navigate({ to: '/' })
      }
    } catch (error: any) {
      if (import.meta.env.DEV) console.error('Error de autenticación:', error) // eslint-disable-line no-console
      
      // Manejo diferenciado de errores
      let errorMessage = 'Error al intentar ingresar. Por favor, inténtelo nuevamente.'
      
      if (error.code === 'ERR_NETWORK') {
        // Error de conexión con el servidor
        errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.'
      } else if (error.response?.status === 0) {
        // Servidor no responde
        errorMessage = 'El servidor no está disponible. Intente más tarde.'
      } else if (error.response?.status === 503) {
        // Servicio no disponible
        errorMessage = 'Servicio temporalmente no disponible. Intente en unos minutos.'
      } else if (error.response?.data?.code === 'INVALID_CREDENTIALS') {
        // Credenciales inválidas específicas
        errorMessage = 'Correo electrónico o contraseña incorrectos.'
      } else if (error.response?.data?.message) {
        // Mensaje específico del backend
        errorMessage = error.response.data.message
      } else if (error.response?.status === 401) {
        // No autorizado genérico
        errorMessage = 'Credenciales incorrectas. Verifique sus datos.'
      } else if (error.response?.status === 500) {
        // Error interno del servidor
        errorMessage = 'Error interno del servidor. Por favor, inténtelo más tarde.'
      }
      
      setAuthError(errorMessage)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Indicador de estado de conexión integrado */}
        <div className='flex justify-center mb-4'>
          <ConnectionStatusIndicator />
        </div>

        {/* Alerta de offline */}
        {!isConnected && (
          <Alert variant='destructive' className='animate-in fade-in-50 slide-in-from-top-2'>
            <Wifi className='h-4 w-4' />
            <AlertTitle>Servidor no disponible</AlertTitle>
            <AlertDescription>
              No se pudo conectar con el servidor. Verifica tu conexión a internet.
            </AlertDescription>
          </Alert>
        )}

        {/* Alerta de errores */}
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
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
                    <Input
                      placeholder='nombre@ejemplo.com'
                      className='h-11 pl-10'
                      disabled={!isConnected || form.formState.isSubmitting}
                      {...field}
                    />
                  </div>
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
                    className={`text-xs font-medium underline-offset-4 hover:underline ${
                      !isConnected ? 'pointer-events-none opacity-50' : ''
                    }`}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <FormControl>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground' />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      className='h-11 pl-10 pr-10'
                      disabled={!isConnected || form.formState.isSubmitting}
                      {...field}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute top-0 right-0 h-11 w-11 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed'
                      disabled={!isConnected}
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
          className='h-12 w-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300'
          disabled={!isConnected || form.formState.isSubmitting}
        >
          {!isConnected ? (
            <>
              <Wifi className='mr-2 h-5 w-5 animate-pulse' />
              Sin conexión...
            </>
          ) : form.formState.isSubmitting ? (
            <>
              <Loader2 className='mr-2 h-5 w-5 animate-spin' />
              Ingresando...
            </>
          ) : (
            <>
              <Lock className='mr-2 h-5 w-5' />
              Ingresar al sistema
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
