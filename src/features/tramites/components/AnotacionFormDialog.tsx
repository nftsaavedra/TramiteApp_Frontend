import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquarePlus } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

const anotacionSchema = z.object({
  contenido: z
    .string()
    .min(3, { message: 'La anotación debe tener al menos 3 caracteres.' }),
})

interface AnotacionFormDialogProps {
  tramiteId: string
  movimientoId?: string
  trigger?: React.ReactNode
}

export function AnotacionFormDialog({
  tramiteId,
  movimientoId,
  trigger,
}: AnotacionFormDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof anotacionSchema>>({
    resolver: zodResolver(anotacionSchema),
    defaultValues: { contenido: '' },
  })

  const addAnotacionMutation = useMutation({
    mutationFn: (newAnotacion: {
      contenido: string
      tramiteId: string
      movimientoId?: string
    }) => api.post('/anotaciones', newAnotacion),
    onSuccess: () => {
      toast.success('Anotación añadida exitosamente.')
      queryClient.invalidateQueries({ queryKey: ['tramite', tramiteId] })
      form.reset()
      setOpen(false)
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al añadir la anotación.'
      )
    },
  })

  function onSubmit(values: z.infer<typeof anotacionSchema>) {
    addAnotacionMutation.mutate({
      ...values,
      tramiteId,
      movimientoId,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant='ghost' size='sm'>
            <MessageSquarePlus className='mr-2 h-4 w-4' />
            Anotar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {movimientoId ? 'Anotar en Movimiento' : 'Nueva Anotación'}
          </DialogTitle>
          <DialogDescription>
            {movimientoId
              ? 'Agrega una nota específica para este movimiento/paso.'
              : 'Agrega una nota general al trámite.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='contenido'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder='Escribe tu anotación aquí...'
                      className='min-h-[100px]'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end pt-2'>
              <Button type='submit' disabled={addAnotacionMutation.isPending}>
                {addAnotacionMutation.isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
