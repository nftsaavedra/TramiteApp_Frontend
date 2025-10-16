// En: src/features/tramites/components/GestionAnotaciones.tsx
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { type TramiteCompleto } from '@/features/tramites/types'
import { AnotacionItem } from './AnotacionItem'

// Esquema de validación para el formulario de nueva anotación
const anotacionSchema = z.object({
  contenido: z
    .string()
    .min(3, { message: 'La anotación debe tener al menos 3 caracteres.' }),
})

interface GestionAnotacionesProps {
  tramite: TramiteCompleto
}

export function GestionAnotaciones({ tramite }: GestionAnotacionesProps) {
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof anotacionSchema>>({
    resolver: zodResolver(anotacionSchema),
    defaultValues: { contenido: '' },
  })

  const addAnotacionMutation = useMutation({
    mutationFn: (newAnotacion: { contenido: string; tramiteId: string }) =>
      api.post('/anotaciones', newAnotacion),
    onSuccess: () => {
      toast.success('Anotación añadida exitosamente.')
      // Invalida la query del trámite para refrescar la lista de anotaciones
      queryClient.invalidateQueries({ queryKey: ['tramite', tramite.id] })
      form.reset()
    },
    onError: () => {
      toast.error('Error al añadir la anotación.')
    },
  })

  function onSubmit(values: z.infer<typeof anotacionSchema>) {
    addAnotacionMutation.mutate({ ...values, tramiteId: tramite.id })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anotaciones</CardTitle>
        <CardDescription>Notas y comentarios sobre el trámite.</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Formulario para añadir una nueva anotación */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <FormField
              control={form.control}
              name='contenido'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder='Escribe una nueva anotación...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              size='sm'
              type='submit'
              disabled={addAnotacionMutation.isPending}
            >
              {addAnotacionMutation.isPending
                ? 'Añadiendo...'
                : 'Añadir Anotación'}
            </Button>
          </form>
        </Form>

        {/* Separador y lista de anotaciones existentes */}
        <div className='space-y-6 border-t pt-4'>
          {tramite.anotaciones.length > 0 ? (
            tramite.anotaciones.map((anotacion) => (
              <AnotacionItem key={anotacion.id} anotacion={anotacion} />
            ))
          ) : (
            <p className='text-muted-foreground py-4 text-center text-sm'>
              No hay anotaciones registradas.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
