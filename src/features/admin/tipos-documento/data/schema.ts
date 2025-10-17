// En: src/features/admin/tipos-documento/data/schema.ts
import { z } from 'zod'

export const tipoDocumentoSchema = z.object({
  // Se encadenan las validaciones. .min(1) asegura que el campo no esté vacío.
  nombre: z
    .string()
    .min(1, { message: 'El nombre es obligatorio' })
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),

  // Para campos opcionales, la validación se aplica solo si se proporciona un valor.
  descripcion: z
    .string()
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres' })
    .optional()
    .or(z.literal('')), // Permite que el string sea opcional o explícitamente vacío
})

export type TipoDocumentoFormValues = z.infer<typeof tipoDocumentoSchema>
