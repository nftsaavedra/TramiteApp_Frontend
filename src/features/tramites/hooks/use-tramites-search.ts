import { z } from 'zod'
import { useSearchParamsSchema } from '@/hooks/use-search-params-schema'

export const tramitesFilterSchema = z.object({
  q: z.string().optional(),
  page: z.number().catch(1),
  limit: z.number().catch(10),
  sortBy: z.string().optional(), // <--- AGREGADO: Importante para el ordenamiento

  // Arrays
  estado: z.array(z.string()).optional(),
  prioridad: z.array(z.string()).optional(),
  oficinaId: z.array(z.string()).optional(),
  tipoDocumentoId: z.array(z.string()).optional(),

  // Fechas
  fechaDocumentoDesde: z.string().optional(),
  fechaDocumentoHasta: z.string().optional(),
  creadoDesde: z.string().optional(),
  creadoHasta: z.string().optional(),
})

export type TramitesSearchParams = z.infer<typeof tramitesFilterSchema>

export function useTramitesSearch() {
  return useSearchParamsSchema(tramitesFilterSchema)
}
