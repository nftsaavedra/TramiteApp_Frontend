// En: src/features/tramites/components/TramiteForm.tsx
import * as z from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
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
// --- IMPORTACIONES AÑADIDAS ---
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAuth } from '@/context/AuthContext' // Asumiendo la ruta del AuthContext

type Oficina = { id: string; nombre: string }
type TipoDocumento = { id: string; nombre: string }
const tiposRegistro = ['RECEPCION', 'ENVIO'] as const

// --- CORRECCIÓN Y AMPLIACIÓN DEL ESQUEMA DE ZOD ---
const formSchema = z
  .object({
    // 1. Nuevo campo para controlar el flujo
    tipoRegistro: z.enum(tiposRegistro, {
      error: 'Seleccione el tipo de registro.',
    }),

    // 2. Campos condicionales
    oficinaRemitenteId: z.string().optional(),
    oficinaDestinoId: z.string().optional(), // Nuevo campo para envío

    // 3. Campos existentes
    tipoDocumentoId: z
      .string()
      .min(1, { message: 'Seleccione un tipo de documento.' }),
    numeroDocumento: z.string().min(1, { message: 'El número es requerido.' }),
    fechaDocumento: z.date({
      error: 'La fecha de recepción es requerida.',
    }),
    asunto: z
      .string()
      .min(5, { message: 'El asunto debe tener al menos 5 caracteres.' }),
    notas: z.string().optional(),
    observaciones: z.string().optional(),
  })
  // 4. Validación condicional refinada
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
// --- FIN DE LA CORRECCIÓN ---

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
  const { user } = useAuth() // Hook para obtener datos del usuario (ej. su oficina)

  const { data: tiposDocumento, isLoading: isLoadingTipos } = useQuery({
    queryKey: ['tiposDocumento'],
    queryFn: fetchTiposDocumento,
  })

  // Se reutiliza la misma consulta de oficinas para ambos selects
  const { data: oficinas, isLoading: isLoadingOficinas } = useQuery({
    queryKey: ['oficinas'],
    queryFn: fetchOficinas,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      tipoRegistro: 'RECEPCION', // Por defecto en Recepción
      numeroDocumento: '',
      asunto: '',
      notas: '',
      observaciones: '',
    },
  })

  // Hook 'watch' para observar el valor de 'tipoRegistro'
  const tipoRegistro = form.watch('tipoRegistro')

  const createTramiteMutation = useMutation({
    mutationFn: (newTramite: z.infer<typeof formSchema>) =>
      api.post('/tramites', newTramite),
    onSuccess: () => {
      toast.success('Trámite creado exitosamente.')
      queryClient.invalidateQueries({ queryKey: ['tramites'] })
      navigate({ to: '/tramites' })
    },
    onError: (error) => {
      console.error('Error al crear el trámite:', error)
      toast.error('Hubo un error al crear el trámite.')
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    let dataToSend = { ...values }

    if (dataToSend.tipoRegistro === 'ENVIO') {
      // Si es Envío, la oficina remitente es la del usuario ("VPIN")
      // y la oficinaDestinoId ya está en 'values'
      dataToSend.oficinaRemitenteId = user?.oficinaId ?? undefined // Asignar la oficina del usuario
    }
    // Si es 'RECEPCION', oficinaRemitenteId y oficinaDestinoId (que será undefined)
    // ya están correctos en 'values'.

    createTramiteMutation.mutate(dataToSend)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Nuevo Trámite</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* --- 1. TIPO DE REGISTRO (NUEVO) --- */}
            <FormField
              control={form.control}
              name='tipoRegistro'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>1. Tipo de Registro</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex items-center gap-6'
                    >
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='RECEPCION' />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          Recepción (Documento Externo)
                        </FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='ENVIO' />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          Envío (Documento Interno)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* --- 2A. Oficina Remitente (Condicional) --- */}
              {tipoRegistro === 'RECEPCION' && (
                <FormField
                  control={form.control}
                  name='oficinaRemitenteId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2. Oficina Remitente</FormLabel>
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

              {/* --- 2B. Oficina Destino (Condicional) (NUEVO) --- */}
              {tipoRegistro === 'ENVIO' && (
                <FormField
                  control={form.control}
                  name='oficinaDestinoId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>2. Oficina Destino</FormLabel>
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
                          {/* Opcional: filtrar la propia oficina del usuario (user.oficinaId) */}
                          {oficinas
                            ?.filter((o) => o.id !== user?.oficinaId)
                            .map((oficina) => (
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

              {/* --- 3. Tipo de Documento --- */}
              <FormField
                control={form.control}
                name='tipoDocumentoId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {tipoRegistro === 'RECEPCION' ? '3.' : '3.'} Tipo de
                      Documento
                    </FormLabel>
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

              {/* --- 4. Número de Documento --- */}
              <FormField
                control={form.control}
                name='numeroDocumento'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>4. N° de Documento (ej. 001-2025)</FormLabel>
                    <FormControl>
                      <Input placeholder='001-2025' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* --- 5. Fecha de Recepción --- */}
              <FormField
                control={form.control}
                name='fechaDocumento'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>
                      5. Fecha del {tipoRegistro === 'RECEPCION' ? 'Documento' : 'Envío'}
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

              {/* --- 6. Asunto --- */}
              <FormField
                control={form.control}
                name='asunto'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>6. Asunto</FormLabel>
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

              {/* --- 7. Notas (Opcional) --- */}
              <FormField
                control={form.control}
                name='notas'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>7. Notas (Opcional)</FormLabel>
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

              {/* --- 8. Observaciones (Opcional) --- */}
              <FormField
                control={form.control}
                name='observaciones'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>8. Observaciones (Opcional)</FormLabel>
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
  )
}