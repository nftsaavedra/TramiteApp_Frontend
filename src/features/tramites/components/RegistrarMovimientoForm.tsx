// En: src/features/tramites/components/RegistrarMovimientoForm.tsx
import * as z from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type Oficina = { id: string; nombre: string }
type TipoDocumento = { id: string; nombre: string }
const tiposAccion = [
  'DERIVACION',
  'RESPUESTA',
  'ASIGNACION',
  'ARCHIVO',
  'CIERRE',
] as const

// 1. Esquema de Zod actualizado para el formulario dinámico
const formSchema = z.object({
  tipoAccion: z.enum(tiposAccion, { error: 'Seleccione un tipo de acción.' }),
  destinos: z
    .array(
      z.object({
        oficinaDestinoId: z
          .string()
          .min(1, { message: 'Seleccione una oficina de destino.' }),
      })
    )
    .min(1, { message: 'Debe seleccionar al menos una oficina de destino.' }),
  // Campos opcionales que se mostrarán condicionalmente
  tipoDocumentoId: z.string().optional(),
  numeroDocumento: z.string().optional(),
  fechaDocumento: z.date().optional(),
  notas: z.string().optional(),
  observaciones: z.string().optional(),
})

// Funciones para obtener datos de la API
const fetchOficinas = async (): Promise<Oficina[]> =>
  (await api.get('/oficinas')).data
const fetchTiposDocumento = async (): Promise<TipoDocumento[]> =>
  (await api.get('/tipos-documento')).data

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

  // Hooks de useQuery para poblar los selects
  const { data: oficinas, isLoading: isLoadingOficinas } = useQuery({
    queryKey: ['oficinas'],
    queryFn: fetchOficinas,
  })
  const { data: tiposDocumento, isLoading: isLoadingTipos } = useQuery({
    queryKey: ['tiposDocumento'],
    queryFn: fetchTiposDocumento,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  })

  // 2. Usamos 'watch' para observar el valor de 'tipoAccion'
  const tipoAccionSeleccionado = form.watch('tipoAccion')
  const generaDocumento =
    tipoAccionSeleccionado === 'DERIVACION' ||
    tipoAccionSeleccionado === 'RESPUESTA'

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
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Movimiento</DialogTitle>
          <DialogDescription>
            Complete los campos para continuar el flujo del trámite.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='max-h-[70vh] space-y-4 overflow-y-auto py-4 pr-6'
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

            {/* 3. Renderizado condicional de los campos adicionales */}
            {generaDocumento && (
              <div className='bg-muted/50 space-y-4 rounded-md border p-4'>
                <p className='text-muted-foreground text-sm font-medium'>
                  Datos del Documento Generado
                </p>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='tipoDocumentoId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Documento</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoadingTipos}
                        >
                          <FormControl>
                            <SelectTrigger>
                              {isLoadingTipos ? (
                                'Cargando...'
                              ) : (
                                <SelectValue placeholder='Ej. PROVEIDO' />
                              )}
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposDocumento?.map((tipo) => (
                              <SelectItem key={tipo.id} value={tipo.id}>
                                {tipo.nombre}
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
                    name='numeroDocumento'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>N° Documento</FormLabel>
                        <FormControl>
                          <Input placeholder='Ej. 001-2025' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='fechaDocumento'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Fecha del Documento</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                className={cn(
                                  'pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Seleccione una fecha</span>
                                )}
                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

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
                      placeholder='Indique la acción a realizar o el contenido del proveído...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='observaciones'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Observaciones adicionales sobre este movimiento...'
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
