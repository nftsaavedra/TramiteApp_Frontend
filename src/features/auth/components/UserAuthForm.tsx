// En: src/features/auth/components/UserAuthForm.tsx
import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
// <-- Usando la ruta corregida
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
  email: z.string().email('Por favor, ingresa un correo electrónico válido.'),
  // --- MEJORA: Añadimos una longitud mínima para la contraseña ---
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.'),
})

export function UserAuthForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [authError, setAuthError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // --- MEJORA 1: Añadimos el modo 'onChange' ---
    // Esto hace que la validación se ejecute mientras el usuario escribe.
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
      setAuthError('Credenciales incorrectas. Por favor, inténtalo de nuevo.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {/* ... (FormField para email no cambia) ... */}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder='nombre@ejemplo.com' {...field} />
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
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type='password' placeholder='••••••••' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {authError && (
          <p className='text-destructive text-sm font-medium'>{authError}</p>
        )}
        <Button
          type='submit'
          className='w-full'
          // --- MEJORA 2: Actualizamos la condición 'disabled' ---
          // El botón se deshabilita si el formulario se está enviando O si no es válido.
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>
    </Form>
  )
}
