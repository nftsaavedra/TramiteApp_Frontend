// En: src/features/users/components/user-form.tsx

'use client'

import React from 'react'
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
import { PasswordInput } from '@/components/password-input'
import { rolesOptions } from '../data/data'
import { userSchema, UserFormValues } from '../data/schema'
import { Oficina, User } from './users-provider'

// En: src/features/users/components/user-form.tsx

type UserFormProps = {
  onSubmit: (values: UserFormValues) => void
  isPending: boolean
  defaultValues?: Partial<User>
  oficinasList: Oficina[]
}

export function UserForm({
  onSubmit,
  isPending,
  defaultValues,
  oficinasList,
}: UserFormProps) {
  const isEditing = !!defaultValues

  const vpinOficinaId =
    oficinasList.find((o) => o.siglas === 'VPIN')?.id ?? null

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      role: defaultValues?.role as any,
      oficinaId: defaultValues?.oficina?.id ?? vpinOficinaId,
      password: '',
      confirmPassword: '',
    },
  })

  // Refinamiento del schema para validación condicional de la contraseña
  const formSchema = userSchema.superRefine((data, ctx) => {
    if (!isEditing && (!data.password || data.password.length < 8)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'La contraseña es obligatoria y debe tener al menos 8 caracteres.',
        path: ['password'],
      })
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    // Al editar, no enviar la contraseña si los campos están vacíos
    if (isEditing && !values.password) {
      const { password, confirmPassword, ...rest } = values
      onSubmit(rest as UserFormValues)
    } else {
      onSubmit(values)
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* ... (FormField para 'name', 'email', 'role', 'oficinaId', 'password', 'confirmPassword' como en el intento anterior) ... */}
        {/* Por brevedad, se omite el JSX repetitivo de los FormField, pero deben estar aquí */}
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder='Ej: Juan Pérez' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='ej: juan.perez@unf.edu.pe'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccione un rol' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rolesOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
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
            name='oficinaId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Oficina</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(value === 'null' ? null : value)
                  }
                  defaultValue={field.value ?? 'null'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccione oficina' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='null'>Ninguna</SelectItem>
                    {oficinasList.map((oficina) => (
                      <SelectItem key={oficina.id} value={oficina.id}>
                        {oficina.siglas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña {isEditing && '(Opcional)'}</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder={
                    isEditing ? 'Dejar en blanco para no cambiar' : '********'
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isPending}>
          {isPending ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </form>
    </Form>
  )
}
