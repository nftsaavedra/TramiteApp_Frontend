// En: src/features/admin/oficinas/components/oficina-form.tsx

'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { oficinaSchema, tiposOficina } from '../data/schema'
import { Oficina } from './columns'

// En: src/features/admin/oficinas/components/oficina-form.tsx
// Importamos el tipo Oficina

type OficinaFormProps = {
  onSubmit: (values: z.infer<typeof oficinaSchema>) => void
  defaultValues?: Partial<Oficina> // Usamos Partial para flexibilidad
  oficinasList: Oficina[] // 1. Recibimos la lista de todas las oficinas
}

export function OficinaForm({
  onSubmit,
  defaultValues,
  oficinasList,
}: OficinaFormProps) {
  const form = useForm<z.infer<typeof oficinaSchema>>({
    resolver: zodResolver(oficinaSchema),
    defaultValues: {
      nombre: defaultValues?.nombre ?? '',
      siglas: defaultValues?.siglas ?? '',
      tipo: defaultValues?.tipo as any,
      parentId: defaultValues?.parentId ?? null,
    },
  })

  // 2. Filtramos la lista para que una oficina no pueda ser su propio padre
  const oficinasPadreDisponibles = oficinasList.filter(
    (o) => o.id !== defaultValues?.id
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='nombre'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Oficina</FormLabel>
              <FormControl>
                <Input placeholder='Ej: Dirección de Calidad' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='siglas'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Siglas</FormLabel>
              <FormControl>
                <Input placeholder='Ej: D-CAL' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tipo'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Oficina</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccione un tipo' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tiposOficina.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo.replace(/_/g, ' ').toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* --- INICIO: CAMPO PARA OFICINA SUPERIOR --- */}
        <FormField
          control={form.control}
          name='parentId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Oficina Superior (Opcional)</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange(value === 'null' ? null : value)
                }
                defaultValue={field.value ?? 'null'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccione una oficina superior' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='null'>
                    Ninguna (Nivel Principal)
                  </SelectItem>
                  {oficinasPadreDisponibles.map((oficina) => (
                    <SelectItem key={oficina.id} value={oficina.id}>
                      {oficina.nombre} ({oficina.siglas})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* --- FIN: CAMPO PARA OFICINA SUPERIOR --- */}
        <Button type='submit'>Guardar Cambios</Button>
      </form>
    </Form>
  )
}
