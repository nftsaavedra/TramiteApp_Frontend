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

type Oficina = { id: string; nombre: string }
type TipoDocumento = { id: string; nombre: string }

// --- CORRECCIÓN DEFINITIVA EN EL ESQUEMA DE ZOD (SINTAXIS MODERNA Y CORRECTA) ---
const formSchema = z.object({
  oficinaRemitenteId: z
    .string()
    .min(1, { message: 'Seleccione una oficina remitente.' }),
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
      numeroDocumento: '',
      asunto: '',
      notas: '',
      observaciones: '',
    },
  })

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
    createTramiteMutation.mutate(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Nuevo Trámite</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* 1. Oficina Remitente */}
              <FormField
                control={form.control}
                name='oficinaRemitenteId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1. Oficina Remitente</FormLabel>
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

              {/* 2. Tipo de Documento */}
              <FormField
                control={form.control}
                name='tipoDocumentoId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2. Tipo de Documento</FormLabel>
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

              {/* 3. Número de Documento */}
              <FormField
                control={form.control}
                name='numeroDocumento'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>3. N° de Documento (ej. 001-2025)</FormLabel>
                    <FormControl>
                      <Input placeholder='001-2025' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 4. Fecha de Recepción */}
              <FormField
                control={form.control}
                name='fechaDocumento'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>4. Fecha de Recepción</FormLabel>
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

              {/* 5. Asunto */}
              <FormField
                control={form.control}
                name='asunto'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>5. Asunto</FormLabel>
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

              {/* 6. Notas (Opcional) */}
              <FormField
                control={form.control}
                name='notas'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>6. Notas (Opcional)</FormLabel>
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

              {/* 7. Observaciones (Opcional) */}
              <FormField
                control={form.control}
                name='observaciones'
                render={({ field }) => (
                  <FormItem className='md:col-span-2'>
                    <FormLabel>7. Observaciones (Opcional)</FormLabel>
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
