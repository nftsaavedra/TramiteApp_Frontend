import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor ingresa un correo electrónico válido.',
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      })
    }
  }, [user, form])

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true)
    try {
      await api.patch('/auth/profile', data)
      toast.success('Perfil actualizado correctamente')

      // Actualizamos el contexto de usuario re-invocando login con el mismo token
      // Esto fuerza un fetch de /auth/profile
      const token = localStorage.getItem('accessToken')
      if (token) {
        await login(token)
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al actualizar el perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder='Tu nombre' {...field} />
              </FormControl>
              <FormDescription>
                Este es el nombre que se mostrará en tu perfil y en los correos
                electrónicos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder='tu@email.com' type='email' {...field} />
              </FormControl>
              <FormDescription>
                El correo debe ser único en el sistema.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='space-y-2'>
            <FormLabel className='text-muted-foreground'>Rol</FormLabel>
            <Input
              value={user?.role || ''}
              disabled
              readOnly
              className='bg-muted text-muted-foreground'
            />
          </div>
          <div className='space-y-2'>
            <FormLabel className='text-muted-foreground'>Oficina ID</FormLabel>
            <Input
              value={user?.oficinaId || 'Sin asignar'}
              disabled
              readOnly
              className='bg-muted text-muted-foreground'
            />
          </div>
        </div>

        <Button type='submit' disabled={loading}>
          {loading ? 'Guardando...' : 'Actualizar perfil'}
        </Button>
      </form>
    </Form>
  )
}
