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
  Info,
  ArrowRightLeft,
  FileText,
  Building2,
  InfoIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { Badge } from '@/components/ui/badge'
// Componentes UI
import { Button } from '@/components/ui/button'
// Usado para etiquetas de pasos
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  // Usado para textos de ayuda
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
// Usado para dividir secciones
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
// 1. Importamos el esquema centralizado
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

  // Configuración del Formulario
  const form = useForm<TramiteFormValues>({
    resolver: zodResolver(tramiteFormSchema),
    mode: 'onChange',
    defaultValues: {
      tipoRegistro: 'RECEPCION',
      numeroDocumento: '',
      asunto: '',
      notas: '',
      observaciones: '',
      oficinaRemitenteId: undefined,
      oficinaDestinoId: undefined,
    },
  })

  const tipoRegistro = form.watch('tipoRegistro')
  const userOficina = oficinas?.find((o) => o.id === user?.oficinaId)

  // Limpieza de campos condicionales
  React.useEffect(() => {
    if (tipoRegistro === 'RECEPCION') {
      form.setValue('oficinaDestinoId', undefined, { shouldValidate: true })
    } else {
      form.setValue('oficinaRemitenteId', undefined, { shouldValidate: true })
    }
  }, [tipoRegistro, form])

  // Mutación para crear
  const createMutation = useMutation({
    mutationFn: (data: TramiteFormValues) => api.post('/tramites', data),
    onSuccess: () => {
      toast.success('Trámite registrado correctamente')
      queryClient.invalidateQueries({ queryKey: ['tramites'] })

      // CORRECCIÓN NAVIGATE: Pasamos los params por defecto obligatorios
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

  // Componente Combobox Interno (Para búsqueda)
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
              {selectedItem
                ? selectedItem.nombre || selectedItem.siglas
                : placeholder}
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
    <TooltipProvider>
      <div className='mx-auto max-w-5xl pb-10'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            {/* --- PASO 1: TIPO DE REGISTRO --- */}
            <Card className='border-l-primary border-l-4 shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg font-semibold'>
                    Tipo de Registro
                  </CardTitle>
                  {/* USO DE BADGE (Corrige error TS6133) */}
                  <Badge variant='secondary'>Paso 1</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name='tipoRegistro'
                  render={({ field }) => (
                    <FormItem className='space-y-4'>
                      <FormControl>
                        <ToggleGroup
                          type='single'
                          value={field.value}
                          onValueChange={(val) => val && field.onChange(val)}
                          className='justify-start gap-4'
                        >
                          <ToggleGroupItem
                            value='RECEPCION'
                            className='data-[state=on]:bg-primary data-[state=on]:text-primary-foreground h-auto border px-6 py-4'
                          >
                            <div className='flex items-center gap-3'>
                              <ArrowRightLeft className='h-5 w-5 rotate-90 md:rotate-0' />
                              <div className='text-left'>
                                <div className='font-bold'>Recepción</div>
                                <div className='text-[10px] opacity-80'>
                                  Externo → Oficina
                                </div>
                              </div>
                            </div>
                          </ToggleGroupItem>

                          <ToggleGroupItem
                            value='ENVIO'
                            className='data-[state=on]:bg-primary data-[state=on]:text-primary-foreground h-auto border px-6 py-4'
                          >
                            <div className='flex items-center gap-3'>
                              <ArrowRightLeft className='h-5 w-5' />
                              <div className='text-left'>
                                <div className='font-bold'>Envío</div>
                                <div className='text-[10px] opacity-80'>
                                  Oficina → Destino
                                </div>
                              </div>
                            </div>
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                      {/* USO DE FORM DESCRIPTION (Corrige error TS6133) */}
                      <FormDescription>
                        Seleccione si el documento ingresa a la institución o se
                        genera internamente.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* --- PASO 2: DATOS DEL DOCUMENTO --- */}
            <Card className='shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                    <FileText className='text-muted-foreground h-5 w-5' />
                    Datos del Documento
                  </CardTitle>
                  <Badge variant='secondary'>Paso 2</Badge>
                </div>
              </CardHeader>
              <CardContent className='grid gap-6 md:grid-cols-2'>
                {/* Campos de Oficina */}
                {tipoRegistro === 'RECEPCION' ? (
                  <FormField
                    control={form.control}
                    name='oficinaRemitenteId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Oficina Remitente</FormLabel>
                        <Combobox
                          options={oficinas || []}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={loadingOficinas}
                          placeholder='Buscar oficina...'
                          searchLabel='Buscar por nombre...'
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <>
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'>
                        Oficina de Origen
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className='text-muted-foreground h-4 w-4' />
                          </TooltipTrigger>
                          <TooltipContent>Su oficina actual</TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <div className='bg-muted text-muted-foreground flex h-10 w-full items-center rounded-md border px-3 text-sm'>
                        <Building2 className='mr-2 h-4 w-4 opacity-50' />
                        {userOficina?.nombre || 'Cargando...'}
                      </div>
                    </FormItem>

                    <FormField
                      control={form.control}
                      name='oficinaDestinoId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Oficina Destino</FormLabel>
                          <Combobox
                            options={
                              oficinas?.filter(
                                (o) => o.id !== user?.oficinaId
                              ) || []
                            }
                            value={field.value}
                            onChange={field.onChange}
                            disabled={loadingOficinas}
                            placeholder='Seleccionar destino...'
                            searchLabel='Buscar destino...'
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Tipo y Número */}
                <FormField
                  control={form.control}
                  name='tipoDocumentoId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Documento</FormLabel>
                      <Combobox
                        options={tipos || []}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={loadingTipos}
                        placeholder='Seleccione tipo...'
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
                      <FormLabel>N° de Documento</FormLabel>
                      <FormControl>
                        <Input placeholder='Ej: 001-2025' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Fecha */}
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
                              variant={'outline'}
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP', { locale: es })
                              ) : (
                                <span>Seleccionar fecha</span>
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
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Asunto */}
                <FormField
                  control={form.control}
                  name='asunto'
                  render={({ field }) => (
                    <FormItem className='md:col-span-2'>
                      <FormLabel>Asunto</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Describa el asunto del documento...'
                          className='min-h-[80px] resize-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* --- PASO 3: DETALLES ADICIONALES --- */}
            <Card className='shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
                    <Info className='text-muted-foreground h-5 w-5' />
                    Información Adicional
                  </CardTitle>
                  <Badge variant='secondary'>Paso 3</Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* USO DE SEPARATOR (Corrige error TS6133) */}
                <Separator />

                <div className='grid gap-6 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='notas'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas Internas</FormLabel>
                        <FormControl>
                          <Textarea placeholder='Uso interno...' {...field} />
                        </FormControl>
                        <FormDescription>
                          Visible solo para su oficina.
                        </FormDescription>
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
                            placeholder='Estado físico, anexos...'
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botones */}
            <div className='flex justify-end gap-4'>
              <Button
                type='button'
                variant='outline'
                // CORRECCIÓN NAVIGATE: Params por defecto
                onClick={() =>
                  navigate({
                    to: '/tramites',
                    search: { page: 1, limit: 10 },
                  })
                }
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                disabled={createMutation.isPending}
                className='min-w-[150px]'
              >
                {createMutation.isPending
                  ? 'Registrando...'
                  : 'Registrar Trámite'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </TooltipProvider>
  )
}
