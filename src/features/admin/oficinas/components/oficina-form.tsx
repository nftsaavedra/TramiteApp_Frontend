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

// En: src/features/admin/oficinas/components/oficina-form.tsx

type OficinaFormProps = {
  onSubmit: (values: z.infer<typeof oficinaSchema>) => void
  defaultValues?: z.infer<typeof oficinaSchema>
}

export function OficinaForm({ onSubmit, defaultValues }: OficinaFormProps) {
  const form = useForm<z.infer<typeof oficinaSchema>>({
    resolver: zodResolver(oficinaSchema),
    defaultValues: defaultValues || {
      nombre: '',
      siglas: '',
      tipo: undefined,
      parentId: null,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
                      {tipo.replace(/_/g, ' ').toLocaleLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Aquí podríamos añadir un selector de oficina padre si fuera necesario */}
        <Button type='submit'>Guardar</Button>
      </form>
    </Form>
  )
}
