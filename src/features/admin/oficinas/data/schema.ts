// En: src/features/admin/oficinas/data/schema.ts
import { z } from 'zod'

// Corresponde al enum `TipoOficina` del backend
export const tiposOficina = [
  'ORGANO_ALTA_DIRECCION',
  'ORGANO_DE_LINEA',
  'UNIDAD_ORGANICA',
  'ORGANO_DE_ASESORAMIENTO',
  'ORGANO_DE_APOYO',
  'EXTERNA',
] as const

export const oficinaSchema = z.object({
  nombre: z
    .string()
    .min(5, 'El nombre debe tener al menos 5 caracteres'),
  siglas: z
    .string()
    .nonempty('Las siglas son obligatorias')
    .min(2, 'Las siglas deben tener al menos 2 caracteres'),
  tipo: z.enum(tiposOficina, {
    error: 'Debe seleccionar un tipo de oficina',
  }),
  parentId: z.string().nullable().optional(),
})

export type OficinaFormValues = z.infer<typeof oficinaSchema>
