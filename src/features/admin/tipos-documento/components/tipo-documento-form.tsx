// En: src/features/admin/tipos-documento/components/tipo-documento-form.tsx

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
import { Textarea } from '@/components/ui/textarea'
// Usaremos Textarea para la descripción
import { tipoDocumentoSchema } from '../data/schema'

// En: src/features/admin/tipos-documento/components/tipo-documento-form.tsx

type TipoDocumentoFormProps = {
  onSubmit: (values: z.infer<typeof tipoDocumentoSchema>) => void
  defaultValues?: z.infer<typeof tipoDocumentoSchema>
}

export function TipoDocumentoForm({
  onSubmit,
  defaultValues,
}: TipoDocumentoFormProps) {
  const form = useForm<z.infer<typeof tipoDocumentoSchema>>({
    resolver: zodResolver(tipoDocumentoSchema),
    defaultValues: defaultValues || {
      nombre: '',
      descripcion: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='nombre'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Tipo de Documento</FormLabel>
              <FormControl>
                <Input
                  placeholder='Ej: Informe, Oficio, Solicitud'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='descripcion'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Describe el propósito de este tipo de documento'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Guardar Cambios</Button>
      </form>
    </Form>
  )
}
