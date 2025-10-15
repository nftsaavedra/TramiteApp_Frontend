// En: src/features/tramites/components/RegistrarMovimientoForm.tsx
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type Oficina = { id: string; nombre: string }
const tiposAccion = [
  'DERIVACION',
  'RESPUESTA',
  'ASIGNACION',
  'ARCHIVO',
  'CIERRE',
] as const

// --- CORRECCIÓN EN EL ESQUEMA DE ZOD ---
const formSchema = z.object({
  tipoAccion: z.enum(tiposAccion, {
    error: 'Seleccione un tipo de acción.', // <-- CORREGIDO
  }),
  destinos: z
    .array(
      z.object({
        oficinaDestinoId: z
          .string()
          .min(1, { message: 'Seleccione una oficina de destino.' }),
      })
    )
    .min(1, { message: 'Debe seleccionar al menos una oficina de destino.' }),
  notas: z.string().optional(),
})
// --- FIN DE LA CORRECCIÓN ---

const fetchOficinas = async (): Promise<Oficina[]> => {
  const { data } = await api.get('/oficinas')
  return data
}

interface RegistrarMovimientoFormProps {
  tramiteId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegistrarMovimientoForm({
  tramiteId,
  open,
  onOpenChange,
}: RegistrarMovimientoFormProps) {
  const queryClient = useQueryClient()

  const { data: oficinas, isLoading: isLoadingOficinas } = useQuery({
    queryKey: ['oficinas'],
    queryFn: fetchOficinas,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  })

  const createMovimientoMutation = useMutation({
    mutationFn: (newMovimiento: z.infer<typeof formSchema>) =>
      api.post('/movimientos', { ...newMovimiento, tramiteId }),
    onSuccess: () => {
      toast.success('Movimiento registrado exitosamente.')
      queryClient.invalidateQueries({ queryKey: ['tramite', tramiteId] })
      onOpenChange(false)
      form.reset()
    },
    onError: (error) => {
      console.error('Error al registrar el movimiento:', error)
      toast.error('Hubo un error al registrar el movimiento.')
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMovimientoMutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Movimiento</DialogTitle>
          <DialogDescription>
            Seleccione una acción y los destinos para continuar el flujo del
            trámite.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 py-4'
          >
            <FormField
              control={form.control}
              name='tipoAccion'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Acción</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Seleccione una acción' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposAccion.map((accion) => (
                        <SelectItem key={accion} value={accion}>
                          {accion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='destinos.0.oficinaDestinoId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Oficina de Destino</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingOficinas}
                  >
                    <FormControl>
                      <SelectTrigger>
                        {isLoadingOficinas ? (
                          'Cargando...'
                        ) : (
                          <SelectValue placeholder='Seleccione un destino' />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {oficinas?.map((oficina) => (
                        <SelectItem key={oficina.id} value={oficina.id}>
                          {oficina.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='notas'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas / Proveído (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Indique la acción a realizar...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' variant='ghost'>
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type='submit'
                disabled={
                  createMovimientoMutation.isPending || !form.formState.isValid
                }
              >
                {createMovimientoMutation.isPending
                  ? 'Registrando...'
                  : 'Registrar Movimiento'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
