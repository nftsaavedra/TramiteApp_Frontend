// En: src/features/admin/usuarios/data/schema.ts
import { z } from 'zod'
import { roles } from './data'

export const userSchema = z
  .object({
    name: z.string().min(1, { message: 'El nombre es obligatorio' }),
    email: z
      .string()
      .min(1, { message: 'El correo electrónico es obligatorio' })
      .email({ message: 'Debe ser un correo electrónico válido' }),
    role: z.enum(roles, {
      message: 'Debe seleccionar un rol válido',
    }),
    oficinaId: z.string().nullable().optional(),
    // La contraseña es opcional al editar, pero requerida al crear
    password: z
      .string()
      .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'], // Error se mostrará en el campo de confirmación
  })

export type UserFormValues = z.infer<typeof userSchema>
