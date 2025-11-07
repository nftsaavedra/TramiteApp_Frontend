// En: src/features/tramites/components/TramiteForm.tsx
import * as z from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { CalendarIcon, InfoIcon } from 'lucide-react'
// MEJORA UI/UX: Importar InfoIcon
import { toast } from 'sonner'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
// --- MEJORA UI/UX: Usar ToggleGroup en lugar de RadioGroup para 'tipoRegistro' ---
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
// --- MEJORA UI/UX: Tooltip para info adicional ---
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import React from 'react'

type Oficina = { id: string; nombre: string; siglas: string } // MEJORA UI/UX: Añadir siglas para tooltip
type TipoDocumento = { id: string; nombre: string }
const tiposRegistro = ['RECEPCION', 'ENVIO'] as const

const formSchema = z
  .object({
    tipoRegistro: z.enum(tiposRegistro, {
      error: 'Seleccione el tipo de registro.',
    }),
    oficinaRemitenteId: z.string().optional(),
    oficinaDestinoId: z.string().optional(),
    tipoDocumentoId: z
      .string()
      .min(1, { message: 'Seleccione un tipo de documento.' }),
    numeroDocumento: z.string().min(1, { message: 'El número es requerido.' }),
    fechaDocumento: z.date({
      error: 'La fecha del documento es requerida.',
    }),
    asunto: z
      .string()
      .min(5, { message: 'El asunto debe tener al menos 5 caracteres.' }),
    notas: z.string().optional(),
    observaciones: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.tipoRegistro === 'RECEPCION') {
        return !!data.oficinaRemitenteId
      }
      return true
    },
    {
      message: 'Seleccione una oficina remitente.',
      path: ['oficinaRemitenteId'],
    }
  )
  .refine(
    (data) => {
      if (data.tipoRegistro === 'ENVIO') {
        return !!data.oficinaDestinoId
      }
      return true
    },
    {
      message: 'Seleccione una oficina de destino.',
      path: ['oficinaDestinoId'],
    }
  )

const fetchTiposDocumento = async (): Promise<TipoDocumento[]> => {
  const { data } = await api.get('/tipos-documento')
  return data
}

const fetchOficinas = async (): Promise<Oficina[]> => {
  const { data } = await api.get('/oficinas')
  return data
}

export function TramiteForm() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data: tiposDocumento, isLoading: isLoadingTipos } = useQuery({
    queryKey: ['tiposDocumento'],
    queryFn: fetchTiposDocumento,
  })

  const { data: oficinas, isLoading: isLoadingOficinas } = useQuery({
    queryKey: ['oficinas'],
    queryFn: fetchOficinas,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      tipoRegistro: 'RECEPCION',
      numeroDocumento: '',
      asunto: '',
      notas: '',
      observaciones: '',
      // MEJORA UI/UX: Vaciar campos condicionales por defecto para evitar que persistan valores
      oficinaRemitenteId: undefined,
      oficinaDestinoId: undefined,
    },
  })

  const tipoRegistro = form.watch('tipoRegistro')

  // MEJORA UI/UX: Resetear campos condicionales al cambiar tipoRegistro
  React.useEffect(() => {
    if (tipoRegistro === 'RECEPCION') {
      form.setValue('oficinaDestinoId', undefined, { shouldValidate: true })
    } else {
      form.setValue('oficinaRemitenteId', undefined, { shouldValidate: true })
    }
  }, [tipoRegistro, form])

  const createTramiteMutation = useMutation({
    mutationFn: (newTramite: z.infer<typeof formSchema>) =>
      api.post('/tramites', newTramite),
    onSuccess: () => {
      toast.success('Trámite creado exitosamente.')
      queryClient.invalidateQueries({ queryKey: ['tramites'] })
      navigate({ to: '/tramites' })
    },
    onError: (error: any) => {
      // MEJORA UI/UX: Capturar mensaje de error específico
      console.error('Error al crear el trámite:', error)
      const errorMessage =
        error.response?.data?.message || 'Hubo un error al crear el trámite.'
      toast.error(errorMessage)
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    createTramiteMutation.mutate(values)
  }

  const userOficina = oficinas?.find((o) => o.id === user?.oficinaId) // MEJORA UI/UX: Obtener objeto de oficina del usuario

  return (
    <TooltipProvider>
      {' '}
      {/* MEJORA UI/UX: Envolver con TooltipProvider */}
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Trámite</CardTitle>
          <p className='text-muted-foreground text-sm'>
            Rellene los campos para registrar un nuevo documento en el sistema.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              {/* --- 1. TIPO DE REGISTRO (MEJORA UI/UX: ToggleGroup) --- */}
              <FormField
                control={form.control}
                name='tipoRegistro'
                render={({ field }) => (
                  <FormItem className='space-y-3'>
                    <FormLabel>1. Tipo de Registro</FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type='single'
                        value={field.value}
                        onValueChange={(value) => {
                          if (value) field.onChange(value)
                        }}
                        className='flex items-center gap-6'
                      >
                        <ToggleGroupItem
                          value='RECEPCION'
                          aria-label='Recepción'
                        >
                          Recepción (Documento Externo)
                        </ToggleGroupItem>
                        <ToggleGroupItem value='ENVIO' aria-label='Envío'>
                          Envío (Documento Interno)
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                {/* --- 2A. Oficina Remitente (Condicional - RECEPCION) --- */}
                {tipoRegistro === 'RECEPCION' && (
                  <FormField
                    control={form.control}
                    name='oficinaRemitenteId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>2. Oficina Remitente</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value} // MEJORA UI/UX: Usar value en lugar de defaultValue
                          disabled={isLoadingOficinas}
                        >
                          <FormControl>
                            <SelectTrigger>
                              {isLoadingOficinas ? (
                                'Cargando...'
                              ) : (
                                <SelectValue placeholder='Seleccione una oficina' />
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
                )}

                {/* --- 2B. Oficina Destino (Condicional - ENVIO) --- */}
                {tipoRegistro === 'ENVIO' && (
                  <>
                    <FormItem>
                      {' '}
                      {/* MEJORA UI/UX: Información de la oficina de origen */}
                      <FormLabel className='flex items-center gap-1'>
                        2. Oficina de Origen
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className='text-muted-foreground h-4 w-4' />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Esta es la oficina desde la que se envía el
                              trámite.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <Input
                        value={userOficina?.nombre || 'Cargando...'}
                        disabled
                        className='font-semibold text-gray-700'
                      />
                    </FormItem>
                    <FormField
                      control={form.control}
                      name='oficinaDestinoId'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>3. Oficina Destino</FormLabel>{' '}
                          {/* MEJORA UI/UX: Numeración ajustada */}
                          <Select
                            onValueChange={field.onChange}
                            value={field.value} // MEJORA UI/UX: Usar value en lugar de defaultValue
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
                              {/* Filtramos la oficina del usuario para no auto-enviarse */}
                              {oficinas
                                ?.filter((o) => o.id !== user?.oficinaId)
                                .map((oficina) => (
                                  <SelectItem
                                    key={oficina.id}
                                    value={oficina.id}
                                  >
                                    {oficina.nombre}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* --- TIPO DE DOCUMENTO (Numeración dinámica) --- */}
                <FormField
                  control={form.control}
                  name='tipoDocumentoId'
                  render={({ field }) => (
                    <FormItem
                      className={cn(
                        tipoRegistro === 'RECEPCION' && 'md:col-start-2' // Ocupa la segunda columna si es Recepción
                      )}
                    >
                      <FormLabel>
                        {tipoRegistro === 'RECEPCION'
                          ? '3. Tipo de Documento'
                          : '4. Tipo de Documento'}{' '}
                        {/* MEJORA UI/UX: Numeración dinámica */}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value} // MEJORA UI/UX: Usar value
                        disabled={isLoadingTipos}
                      >
                        <FormControl>
                          <SelectTrigger>
                            {isLoadingTipos ? (
                              'Cargando...'
                            ) : (
                              <SelectValue placeholder='Seleccione un tipo' />
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

                {/* --- NÚMERO DE DOCUMENTO (Numeración dinámica) --- */}
                <FormField
                  control={form.control}
                  name='numeroDocumento'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tipoRegistro === 'RECEPCION'
                          ? '4. N° de Documento'
                          : '5. N° de Documento'}{' '}
                        {/* MEJORA UI/UX: Numeración dinámica */}
                        {' (ej. 001-2025)'}
                      </FormLabel>
                      <FormControl>
                        <Input placeholder='001-2025' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* --- FECHA (Numeración y etiqueta dinámica) --- */}
                <FormField
                  control={form.control}
                  name='fechaDocumento'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>
                        {tipoRegistro === 'RECEPCION'
                          ? '5. Fecha del Documento'
                          : '6. Fecha del Envío'}{' '}
                        {/* MEJORA UI/UX: Etiqueta y Numeración dinámica */}
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant='outline'
                              className={cn(
                                'w-full pl-3 text-left font-normal',
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
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* --- ASUNTO (Numeración dinámica) --- */}
                <FormField
                  control={form.control}
                  name='asunto'
                  render={({ field }) => (
                    <FormItem className='md:col-span-2'>
                      <FormLabel>
                        {tipoRegistro === 'RECEPCION'
                          ? '6. Asunto'
                          : '7. Asunto'}{' '}
                        {/* MEJORA UI/UX: Numeración dinámica */}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Asunto detallado del trámite...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* --- NOTAS (Numeración dinámica) --- */}
                <FormField
                  control={form.control}
                  name='notas'
                  render={({ field }) => (
                    <FormItem className='md:col-span-2'>
                      <FormLabel>
                        {tipoRegistro === 'RECEPCION'
                          ? '7. Notas (Opcional)'
                          : '8. Notas (Opcional)'}{' '}
                        {/* MEJORA UI/UX: Numeración dinámica */}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Información adicional o complementaria...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* --- OBSERVACIONES (Numeración dinámica) --- */}
                <FormField
                  control={form.control}
                  name='observaciones'
                  render={({ field }) => (
                    <FormItem className='md:col-span-2'>
                      <FormLabel>
                        {tipoRegistro === 'RECEPCION'
                          ? '8. Observaciones (Opcional)'
                          : '9. Observaciones (Opcional)'}{' '}
                        {/* MEJORA UI/UX: Numeración dinámica */}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Observaciones sobre el estado o contenido del documento...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* MEJORA UI/UX: Reorganizar botones */}
              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => navigate({ to: '/tramites' })}
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  disabled={
                    createTramiteMutation.isPending || !form.formState.isValid
                  }
                >
                  {createTramiteMutation.isPending
                    ? 'Creando...'
                    : 'Crear Trámite'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
