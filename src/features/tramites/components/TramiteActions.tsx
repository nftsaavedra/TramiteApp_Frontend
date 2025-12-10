import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Archive, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { TramiteCompleto } from '../types'

// Esquema de validación para la nota obligatoria
const actionSchema = z.object({
  contenido: z
    .string()
    .min(5, 'La observación debe tener al menos 5 caracteres.')
    .max(500, 'La observación no puede exceder 500 caracteres.'),
})

interface TramiteActionsProps {
  tramite: TramiteCompleto
}

export function TramiteActions({ tramite }: TramiteActionsProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [openFinalizar, setOpenFinalizar] = useState(false)
  const [openArchivar, setOpenArchivar] = useState(false)

  // Mutación para Finalizar
  const finalizarMutation = useMutation({
    mutationFn: (data: { contenido: string }) =>
      api.patch(`/tramites/${tramite.id}/finalizar`, data),
    onSuccess: () => {
      toast.success('Trámite finalizado correctamente')
      setOpenFinalizar(false)
      queryClient.invalidateQueries({ queryKey: ['tramite', tramite.id] })
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al finalizar el trámite'
      )
    },
  })

  // Mutación para Archivar
  const archivarMutation = useMutation({
    mutationFn: (data: { contenido: string }) =>
      api.patch(`/tramites/${tramite.id}/archivar`, data),
    onSuccess: () => {
      toast.info('Trámite archivado')
      setOpenArchivar(false)
      queryClient.invalidateQueries({ queryKey: ['tramite', tramite.id] })
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Error al archivar el trámite'
      )
    },
  })

  // Verificar si se puede finalizar (ubicación VPIn)
  // Como no tenemos constante de VPIn, asumimos que si el usuario ve el botón y está en proceso, puede intentar.
  // La validación real está en backend.
  // Podemos agregar una prop isVPInLocation si tuvieramos el contexto.

  if (tramite.estado !== 'EN_PROCESO') return null

  return (
    <div className='flex items-center gap-2'>
      <ActionDialog
        title='Finalizar Trámite'
        description='¿Estás seguro de finalizar este trámite? Esta acción concluirá el proceso definitivamente. Debes indicar una nota de cierre.'
        triggerLabel='Finalizar'
        triggerIcon={CheckCircle2}
        triggerVariant='default' // Primary color
        confirmLabel='Finalizar Trámite'
        confirmVariant='default'
        isOpen={openFinalizar}
        onOpenChange={setOpenFinalizar}
        mutation={finalizarMutation}
      />

      <ActionDialog
        title='Archivar Trámite'
        description='¿Deseas archivar este trámite? Esto indicará que el trámite no procedió o se canceló. Debes indicar el motivo.'
        triggerLabel='Archivar'
        triggerIcon={Archive}
        triggerVariant='outline' // Secondary/Danger logic but outlined
        confirmLabel='Archivar Trámite'
        confirmVariant='secondary' // Or destructive if preferred
        isOpen={openArchivar}
        onOpenChange={setOpenArchivar}
        mutation={archivarMutation}
      />
    </div>
  )
}

// Subcomponente reutilizable para el Dialogo con Formulario
function ActionDialog({
  title,
  description,
  triggerLabel,
  triggerIcon: Icon,
  triggerVariant = 'outline',
  confirmLabel,
  confirmVariant = 'default',
  isOpen,
  onOpenChange,
  mutation,
}: {
  title: string
  description: string
  triggerLabel: string
  triggerIcon: any
  triggerVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  confirmLabel: string
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary'
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  mutation: any
}) {
  const form = useForm<z.infer<typeof actionSchema>>({
    resolver: zodResolver(actionSchema),
    defaultValues: { contenido: '' },
  })

  function onSubmit(values: z.infer<typeof actionSchema>) {
    mutation.mutate(values)
  }

  // Reset form when dialog opens/closes
  const handleOpenChange = (open: boolean) => {
    if (!open) form.reset()
    onOpenChange(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className='gap-2'>
          <Icon className='h-4 w-4' />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 py-2'
          >
            <FormField
              control={form.control}
              name='contenido'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nota / Observación (Obligatorio)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Ingrese el motivo o detalle de la acción...'
                      className='min-h-[100px] resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='ghost'
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                variant={confirmVariant}
                disabled={mutation.isPending}
                className='gap-2'
              >
                {mutation.isPending && (
                  <Loader2 className='h-4 w-4 animate-spin' />
                )}
                {confirmLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
