// En: src/features/tramites/components/RegistrarMovimientoForm.tsx
import { useState, useEffect } from 'react'
import * as z from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { es } from 'date-fns/locale'
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Send,
  Inbox,
  FileText,
  Building2,
} from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
  FormDescription,
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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

type Oficina = { id: string; nombre: string; siglas: string }
type TipoDocumento = { id: string; nombre: string }

const todosTiposAccion = ['ENVIO', 'RECEPCION'] as const

// Esquema de Zod actualizado
const formSchema = z
  .object({
    modo: z.enum(['ENVIO', 'RECEPCION']), // Campo de control UI
    tipoAccion: z.enum(todosTiposAccion), // Obligatorio
    oficinaDestinoId: z.string().optional(),
    asunto: z.string().optional(),
    tipoDocumentoId: z.string().optional(),
    numeroDocumento: z.string().optional(),
    fechaRecepcion: z.date().optional(),
    notas: z.string().optional(),
    observaciones: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.modo === 'ENVIO' && !data.oficinaDestinoId) {
        return false
      }
      return true
    },
    {
      message: 'Seleccione una oficina de destino.',
      path: ['oficinaDestinoId'],
    }
  )

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
  const { user } = useAuth()

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
    defaultValues: {
      modo: 'ENVIO',
      tipoAccion: 'ENVIO',
      asunto: '',
      notas: '',
      observaciones: '',
    },
  })

  const modo = form.watch('modo')

  // Efecto para resetear/ajustar valores al cambiar de modo
  useEffect(() => {
    if (modo === 'ENVIO') {
      form.setValue('tipoAccion', 'ENVIO')
    } else {
      form.setValue('tipoAccion', 'RECEPCION')
      form.setValue('oficinaDestinoId', undefined)
    }
  }, [modo, form])

  const createMovimientoMutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      // Preparamos el payload
      // CAMBIO: Mapeamos modo a tipoAccion (ENVIO o RECEPCION)
      const { modo, tipoAccion, ...payload } = values
      const actionToSend = modo // 'ENVIO' | 'RECEPCION'

      return api.post('/movimientos', {
        ...payload,
        tramiteId,
        tipoAccion: actionToSend,
      })
    },
    onSuccess: () => {
      toast.success('Movimiento registrado exitosamente.')
      queryClient.invalidateQueries({ queryKey: ['tramite', tramiteId] })
      onOpenChange(false)
      form.reset()
    },
    onError: (error: any) => {
      console.error('Error al registrar el movimiento:', error)
      toast.error(
        error.response?.data?.message ||
          'Hubo un error al registrar el movimiento.'
      )
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMovimientoMutation.mutate(values)
  }

  // Componente Combobox reutilizable (local)
  const Combobox = ({
    options,
    value,
    onChange,
    placeholder,
    searchLabel,
    disabled,
  }: {
    options: any[]
    value?: string
    onChange: (val: string) => void
    placeholder: string
    searchLabel: string
    disabled?: boolean
  }) => {
    const [open, setOpen] = useState(false)
    const selectedItem = options.find((item) => item.id === value)

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                'w-full justify-between font-normal',
                !value && 'text-muted-foreground'
              )}
            >
              <span className='truncate'>
                {selectedItem
                  ? selectedItem.nombre || selectedItem.siglas
                  : placeholder}
              </span>
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className='w-[300px] p-0' align='start'>
          <Command>
            <CommandInput placeholder={searchLabel} />
            <CommandList>
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
              <CommandGroup>
                {options.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.nombre}
                    onSelect={() => {
                      onChange(item.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === item.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className='flex flex-col'>
                      <span>{item.nombre}</span>
                      {item.siglas && (
                        <span className='text-muted-foreground text-xs'>
                          {item.siglas}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Movimiento</DialogTitle>
          <DialogDescription>
            Defina el flujo del documento y complete los detalles.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* CONFIGURACIÓN Y FLUJO */}
            <div className='grid gap-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='modo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Movimiento</FormLabel>
                      <FormControl>
                        <ToggleGroup
                          type='single'
                          value={field.value}
                          onValueChange={(val) => val && field.onChange(val)}
                          className='flex flex-col gap-2'
                        >
                          <ToggleGroupItem
                            value='ENVIO'
                            className='data-[state=on]:bg-primary/5 data-[state=on]:border-primary data-[state=on]:text-primary h-auto justify-start gap-3 border px-4 py-3'
                          >
                            <div className='bg-background rounded-full border p-2 shadow-sm'>
                              <Send className='h-4 w-4' />
                            </div>
                            <div className='text-left'>
                              <div className='font-semibold'>Envío</div>
                              <div className='text-muted-foreground text-xs'>
                                Enviar a otra oficina
                              </div>
                            </div>
                          </ToggleGroupItem>

                          <ToggleGroupItem
                            value='RECEPCION'
                            className='data-[state=on]:bg-primary/5 data-[state=on]:border-primary data-[state=on]:text-primary h-auto justify-start gap-3 border px-4 py-3'
                          >
                            <div className='bg-background rounded-full border p-2 shadow-sm'>
                              <Inbox className='h-4 w-4' />
                            </div>
                            <div className='text-left'>
                              <div className='font-semibold'>Recepción</div>
                              <div className='text-muted-foreground text-xs'>
                                De externo a mi oficina
                              </div>
                            </div>
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* DESTINO / ORIGEN */}
              <div className='space-y-4'>
                {modo === 'ENVIO' ? (
                  <FormField
                    control={form.control}
                    name='oficinaDestinoId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Oficina de Destino</FormLabel>
                        <Combobox
                          options={
                            oficinas?.filter(
                              (o) =>
                                o.id !== user?.oficinaId && o.siglas !== 'VPIN'
                            ) || []
                          }
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isLoadingOficinas}
                          placeholder='Buscar destino...'
                          searchLabel='Nombre de oficina...'
                        />
                        <FormDescription className='text-xs'>
                          ¿A dónde se envía el documento?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className='space-y-2'>
                    <FormLabel>Oficina de Destino (Mi Oficina)</FormLabel>
                    <div className='bg-muted/50 text-muted-foreground flex h-10 w-full items-center gap-2 rounded-md border px-3 text-sm'>
                      <Building2 className='h-4 w-4' />
                      <span className='truncate'>Recepción en mi oficina</span>
                    </div>
                    <FormDescription className='text-xs'>
                      El documento ingresa a su bandeja.
                    </FormDescription>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* DATOS DEL DOCUMENTO */}
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <FileText className='text-muted-foreground h-5 w-5' />
                <h4 className='font-medium'>Datos del Documento</h4>
              </div>

              <div className='grid gap-4 md:grid-cols-3'>
                <FormField
                  control={form.control}
                  name='tipoDocumentoId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoadingTipos}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccione...' />
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
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder='Ej. 001-2025' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='fechaRecepcion'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Fecha y Hora</FormLabel>
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
                                format(field.value, 'PPP p', { locale: es })
                              ) : (
                                <span>Seleccione fecha</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={(date) => {
                              if (!date) {
                                field.onChange(undefined)
                                return
                              }
                              if (field.value) {
                                const newDate = new Date(date)
                                newDate.setHours(field.value.getHours())
                                newDate.setMinutes(field.value.getMinutes())
                                field.onChange(newDate)
                              } else {
                                field.onChange(date)
                              }
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                            locale={es}
                          />
                          <div className='border-t p-3'>
                            <Input
                              type='time'
                              className='mt-2'
                              value={
                                field.value ? format(field.value, 'HH:mm') : ''
                              }
                              onChange={(e) => {
                                const time = e.target.value
                                if (!time) return
                                const [hours, minutes] = time
                                  .split(':')
                                  .map(Number)
                                const newDate = field.value
                                  ? new Date(field.value)
                                  : new Date()
                                newDate.setHours(hours)
                                newDate.setMinutes(minutes)
                                field.onChange(newDate)
                              }}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='asunto'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asunto Específico</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Asunto específico de este movimiento...'
                        className='min-h-[80px] resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='notas'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas / Proveído</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Instrucciones o notas...'
                        className='resize-none'
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
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Observaciones adicionales...'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className='gap-2 sm:gap-0'>
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
