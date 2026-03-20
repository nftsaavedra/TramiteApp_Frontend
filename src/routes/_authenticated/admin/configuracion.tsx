import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createFileRoute } from '@tanstack/react-router'
import api from '@/lib/api'
import { Container } from '@/components/ui/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Building2, Key, UserCheck, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/admin/configuracion')({
  component: ConfiguracionSistema,
})

const systemConfigSchema = z.object({
  rootOfficeName: z.string().min(5, 'El nombre debe tener al menos 5 caracteres'),
  rootOfficeSiglas: z.string().min(2, 'Las siglas deben tener al menos 2 caracteres').max(10),
})

interface SystemConfigData {
  id: string
  rootOfficeName: string
  rootOfficeSiglas: string
  defaultRole: string
  isInitialized: boolean
}

export function ConfiguracionSistema() {
  const queryClient = useQueryClient()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  // Obtener configuración actual
  const { data: configData, isLoading, error } = useQuery<{ data: SystemConfigData }>({
    queryKey: ['system-config'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/system-config')
        return response.data
      } catch (error: unknown) {
        const err = error as { response?: { status?: number; data?: { message?: string } } }
        // Si el error es que no está inicializado, retornar null
        if (err.response?.status === 500 || err.response?.data?.message?.includes('no inicializado')) {
          return null
        }
        throw error
      }
    },
    retry: false,
  })

  const config = configData?.data

  // Formulario para inicialización (cuando no está inicializado)
  const formInitialize = useForm<z.infer<typeof systemConfigSchema>>({
    resolver: zodResolver(systemConfigSchema),
    defaultValues: {
      rootOfficeName: '',
      rootOfficeSiglas: '',
    },
  })

  // Formulario para actualización (cuando ya está inicializado)
  const formUpdate = useForm<z.infer<typeof systemConfigSchema>>({
    resolver: zodResolver(systemConfigSchema),
    values: {
      rootOfficeName: config?.rootOfficeName || '',
      rootOfficeSiglas: config?.rootOfficeSiglas || '',
    },
  })

  // Mutación para inicializar
  const initializeMutation = useMutation({
    mutationFn: async (values: z.infer<typeof systemConfigSchema>) => {
      const response = await api.post('/api/system-config/initialize', values)
      return response.data
    },
    onSuccess: () => {
      toast.success('Sistema inicializado exitosamente')
      queryClient.invalidateQueries({ queryKey: ['system-config'] })
      setIsInitializing(false)
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Error al inicializar el sistema')
      setIsInitializing(false)
    },
  })

  // Mutación para actualizar
  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof systemConfigSchema>) => {
      const response = await api.post('/api/system-config/update', values)
      return response.data
    },
    onSuccess: () => {
      toast.success('Configuración actualizada exitosamente')
      queryClient.invalidateQueries({ queryKey: ['system-config'] })
      setIsUpdating(false)
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Error al actualizar la configuración')
      setIsUpdating(false)
    },
  })

  const handleInitializeSubmit = (values: z.infer<typeof systemConfigSchema>) => {
    setIsInitializing(true)
    initializeMutation.mutate(values)
  }

  const handleUpdateSubmit = (values: z.infer<typeof systemConfigSchema>) => {
    setIsUpdating(true)
    updateMutation.mutate(values)
  }

  if (isLoading) {
    return (
      <Container size='lg'>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Container>
    )
  }

  // Sistema no inicializado - mostrar formulario de inicialización
  if (!config || !config.isInitialized) {
    return (
      <Container size='lg'>
        <div className="space-y-[clamp(1.5rem,1.25rem+1.25vw,3rem)] py-[clamp(1.5rem,1.25rem+1.25vw,3rem)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Configuración Inicial del Sistema</h2>
            <p className="text-muted-foreground">
              Primer arranque detectado. Configura la oficina raíz para comenzar.
            </p>
          </div>
          <Badge variant="secondary">
            <RefreshCw className="mr-1 h-3 w-3" />
            Pendiente de Inicializar
          </Badge>
        </div>

        <Alert>
          <Building2 className="h-4 w-4" />
          <AlertDescription>
            Es necesario configurar la oficina raíz antes de usar el sistema. Esta configuración se realizará una sola vez.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Oficina Raíz del Sistema
            </CardTitle>
            <CardDescription>
              Ingresa los datos de la oficina principal que servirá como punto de partida
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...formInitialize}>
              <form onSubmit={formInitialize.handleSubmit(handleInitializeSubmit)} className="space-y-4">
                <FormField
                  control={formInitialize.control}
                  name="rootOfficeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Oficina Raíz</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input placeholder="Ej: Viceministerio de Planificación e Inversión" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formInitialize.control}
                  name="rootOfficeSiglas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Siglas</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input placeholder="Ej: VPIN" className="pl-10 uppercase" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    disabled={initializeMutation.isPending || isInitializing}
                    size="lg"
                  >
                    {initializeMutation.isPending || isInitializing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Inicializando Sistema...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Inicializar Sistema
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Container>
    )
  }

  // Sistema ya inicializado - mostrar formulario normal de actualización
  if (error) {
    return (
      <Container size='lg'>
        <Alert variant="destructive">
          <AlertDescription>
            Error al cargar la configuración del sistema. Verifica tu conexión o permisos.
          </AlertDescription>
        </Alert>
      </Container>
    )
  }

  return (
    <Container size='lg'>
      <div className="space-y-[clamp(1.5rem,1.25rem+1.25vw,3rem)] py-[clamp(1.5rem,1.25rem+1.25vw,3rem)]">
      {/* Header con estado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configuración del Sistema</h2>
          <p className="text-muted-foreground">
            Gestiona la configuración global de la oficina raíz y parámetros del sistema
          </p>
        </div>
        <Badge variant={config.isInitialized ? 'default' : 'secondary'}>
          {config.isInitialized ? (
            <>
              <Building2 className="mr-1 h-3 w-3" />
              Sistema Inicializado
            </>
          ) : (
            <>
              <RefreshCw className="mr-1 h-3 w-3" />
              Pendiente de Inicializar
            </>
          )}
        </Badge>
      </div>

      {/* Tarjeta de información */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Oficina Raíz del Sistema
          </CardTitle>
          <CardDescription>
            Esta es la oficina principal que se utiliza como punto de partida para todos los trámites
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...formUpdate}>
            <form onSubmit={formUpdate.handleSubmit(handleUpdateSubmit)} className="space-y-4">
              <FormField
                control={formUpdate.control}
                name="rootOfficeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Oficina Raíz</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Ej: Viceministerio de Planificación e Inversión" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formUpdate.control}
                name="rootOfficeSiglas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Siglas</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input placeholder="Ej: VPIN" className="pl-10 uppercase" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between pt-4">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending || isUpdating}
                >
                  {updateMutation.isPending || isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Actualizar Configuración
                    </>
                  )}
                </Button>

                {config.isInitialized && (
                  <p className="text-xs text-muted-foreground">
                    Última actualización: {new Date().toLocaleString()}
                  </p>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Configuración Adicional
          </CardTitle>
          <CardDescription>
            Otros parámetros de configuración del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium">Rol por Defecto</p>
              <p className="text-xs text-muted-foreground">
                Rol asignado automáticamente a nuevos usuarios
              </p>
            </div>
            <Badge variant="outline">{config.defaultRole}</Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium">Estado del Sistema</p>
              <p className="text-xs text-muted-foreground">
                Indica si la configuración inicial ha sido completada
              </p>
            </div>
            <Badge variant={config.isInitialized ? 'default' : 'secondary'}>
              {config.isInitialized ? 'Inicializado' : 'Pendiente'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium">ID de Configuración</p>
              <p className="text-xs text-muted-foreground">
                Identificador único de esta configuración
              </p>
            </div>
            <code className="text-xs bg-muted px-2 py-1 rounded">{config.id}</code>
          </div>
        </CardContent>
      </Card>

      {/* Advertencia */}
      {!config.isInitialized && (
        <Alert variant="destructive">
          <AlertDescription>
            <strong>Importante:</strong> El sistema no está completamente inicializado. 
            Algunas funcionalidades pueden no estar disponibles hasta que se complete la configuración.
          </AlertDescription>
        </Alert>
      )}
    </div>
  </Container>
  )
}
