import React, { useState } from 'react'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { es } from 'date-fns/locale'
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  ArrowRightLeft,
  FileText,
  Building2,
  Send,
  Inbox,
} from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
// Componentes UI
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { tramiteFormSchema, type TramiteFormValues } from '../data/schema'

// Tipos
type Oficina = { id: string; nombre: string; siglas: string }
type TipoDocumento = { id: string; nombre: string }

// Fetchers
const fetchTiposDocumento = async (): Promise<TipoDocumento[]> =>
  (await api.get('/tipos-documento')).data

const fetchOficinas = async (): Promise<Oficina[]> =>
  (await api.get('/oficinas')).data

export function TramiteForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  // Queries
  const { data: tipos, isLoading: loadingTipos } = useQuery({
    queryKey: ['tiposDocumento'],
    queryFn: fetchTiposDocumento,
  })

  const { data: oficinas, isLoading: loadingOficinas } = useQuery({
    queryKey: ['oficinas'],
    queryFn: fetchOficinas,
  })

  const form = useForm<TramiteFormValues>({
    resolver: zodResolver(tramiteFormSchema),
    mode: 'onChange',
    defaultValues: {
      tipoRegistro: 'RECEPCION',
      numeroDocumento: '',
      asunto: '',
      // NOTA: Campo 'notas' eliminado
      observaciones: '',
      oficinaRemitenteId: undefined,
      oficinaDestinoId: undefined,
      // Inicializamos fecha como undefined para que el usuario seleccione
      fechaRecepcion: undefined,
    },
  })

  const tipoRegistro = form.watch('tipoRegistro')

  // Lógica de visualización de Oficina de Usuario:
  // 1. Buscamos por ID asignado al usuario.
  // 2. Si no tiene, hacemos fallback a la oficina VPIN (ROOT).
  const userOficina =
    oficinas?.find((o) => o.id === user?.oficinaId) ||
    oficinas?.find((o) => o.siglas === 'VPIN')

  // Efecto de limpieza al cambiar tipo
  React.useEffect(() => {
    if (tipoRegistro === 'RECEPCION') {
      form.setValue('oficinaDestinoId', undefined, { shouldValidate: true })
    } else {
      form.setValue('oficinaRemitenteId', undefined, { shouldValidate: true })
    }
  }, [tipoRegistro, form])

  const createMutation = useMutation({
    mutationFn: (data: TramiteFormValues) => api.post('/tramites', data),
    onSuccess: () => {
      toast.success('Trámite registrado correctamente')
      queryClient.invalidateQueries({ queryKey: ['tramites'] })
      navigate({
        to: '/tramites',
        search: { page: 1, limit: 10 },
      })
    },
    onError: (err: any) => {
      console.error(err)
      toast.error(err.response?.data?.message || 'Error al crear trámite')
    },
  })

  const onSubmit = (data: TramiteFormValues) => createMutation.mutate(data)

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
                  ? selectedItem.siglas || selectedItem.nombre
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
    <div className='mx-auto w-full pb-10'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* LAYOUT PRINCIPAL: GRID 12 Columnas */}
          <div className='grid items-start gap-6 lg:grid-cols-12'>
            {/* --- COLUMNA IZQUIERDA (4/12): CONFIGURACIÓN Y FLUJO --- */}
            <div className='space-y-6 lg:col-span-4'>
              {/* 1. Tipo de Trámite */}
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Configuración</CardTitle>
                  <CardDescription>
                    Defina el flujo del documento
                  </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='tipoRegistro'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Movimiento</FormLabel>
                        <FormControl>
                          <ToggleGroup
                            type='single'
                            value={field.value}
                            onValueChange={(val) => val && field.onChange(val)}
                            className='w-full flex-col items-stretch gap-2'
                          >
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
                                  De mi oficina a otra
                                </div>
                              </div>
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* 2. Oficinas (Lógica condicional agrupada) */}
                  <div className='space-y-4'>
                    {tipoRegistro === 'RECEPCION' ? (
                      <FormField
                        control={form.control}
                        name='oficinaRemitenteId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Oficina Remitente (Origen)</FormLabel>
                            <Combobox
                              // FILTRO MEJORADO:
                              // Excluye mi propia oficina y la oficina VPIN (ROOT) de los remitentes posibles
                              options={
                                oficinas?.filter(
                                  (o) =>
                                    o.id !== user?.oficinaId &&
                                    o.siglas !== 'VPIN'
                                ) || []
                              }
                              value={field.value}
                              onChange={field.onChange}
                              disabled={loadingOficinas}
                              placeholder='Buscar remitente...'
                              searchLabel='Nombre de oficina...'
                            />
                            <FormDescription className='text-xs'>
                              ¿Quién envía el documento físico?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <>
                        <FormItem>
                          <FormLabel>Oficina de Origen</FormLabel>
                          <div className='bg-muted/50 text-muted-foreground flex h-10 w-full items-center gap-2 rounded-md border px-3 text-sm'>
                            <Building2 className='h-4 w-4' />
                            <span className='truncate'>
                              {userOficina
                                ? `${userOficina.nombre} (${userOficina.siglas})`
                                : loadingOficinas
                                  ? 'Cargando información...'
                                  : 'No se encontró oficina asignada'}
                            </span>
                          </div>
                        </FormItem>

                        <div className='flex justify-center'>
                          <ArrowRightLeft className='text-muted-foreground h-4 w-4 rotate-90' />
                        </div>

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
                                      o.id !== user?.oficinaId &&
                                      o.siglas !== 'VPIN'
                                  ) || []
                                }
                                value={field.value}
                                onChange={field.onChange}
                                disabled={loadingOficinas}
                                placeholder='Buscar destino...'
                                searchLabel='Nombre de oficina...'
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* --- COLUMNA DERECHA (8/12): DATOS DEL DOCUMENTO --- */}
            <div className='space-y-6 lg:col-span-8'>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <FileText className='text-muted-foreground h-5 w-5' />
                    Datos del Documento
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-6'>
                  {/* Fila 1: Tipo, Número, Fecha */}
                  <div className='grid gap-6 md:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='tipoDocumentoId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo</FormLabel>
                          <Combobox
                            options={tipos || []}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={loadingTipos}
                            placeholder='Seleccione...'
                            searchLabel='Buscar tipo...'
                          />
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
                            <Input placeholder='Ej: 001-2025' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* CAMBIO: Renombrado a fechaRecepcion */}
                    <FormField
                      control={form.control}
                      name='fechaRecepcion'
                      render={({ field }) => (
                        <FormItem className='flex flex-col'>
                          <FormLabel>Fecha de Recepción</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'dd/MM/yyyy HH:mm', {
                                      locale: es,
                                    })
                                  ) : (
                                    <span>Seleccionar fecha y hora</span>
                                  )}
                                  <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className='w-auto p-0'
                              align='start'
                            >
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
                                  date > new Date() ||
                                  date < new Date('1900-01-01')
                                }
                                initialFocus
                                locale={es}
                              />
                              <div className='border-t p-3'>
                                <Input
                                  type='time'
                                  className='mt-2'
                                  value={
                                    field.value
                                      ? format(field.value, 'HH:mm')
                                      : ''
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

                  {/* Fila 2: Asunto */}
                  <FormField
                    control={form.control}
                    name='asunto'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asunto Principal</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Describa el contenido del documento...'
                            className='min-h-[100px] resize-none text-base'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Fila 3: Observaciones (Full Width) */}
                  <div className='grid gap-6'>
                    <FormField
                      control={form.control}
                      name='observaciones'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observaciones</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Detalles físicos (anexos, folios, estado del documento)...'
                              className='h-24 resize-none'
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className='mt-8 flex justify-end gap-4 border-t pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                navigate({
                  to: '/tramites',
                  search: { page: 1, limit: 10 },
                })
              }
              className='w-full sm:w-auto'
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              disabled={createMutation.isPending}
              className='w-full min-w-[150px] sm:w-auto'
              size='lg'
            >
              {createMutation.isPending
                ? 'Registrando...'
                : 'Registrar Trámite'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
