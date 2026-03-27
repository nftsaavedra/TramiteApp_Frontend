import { z } from 'zod'
import { useSearchParamsSchema } from '@/hooks/use-search-params-schema'

export const oficinasFilterSchema = z.object({
  q: z.string().optional(), // Búsqueda global (nombre, siglas)
  page: z.number().catch(1),
  limit: z.number().catch(10),
  sortBy: z.string().optional(),

  // Filtros específicos
  tipo: z.array(z.string()).optional(), // Soporta múltiples tipos
})

export type OficinasSearchParams = z.infer<typeof oficinasFilterSchema>

export function useOficinasSearch() {
  return useSearchParamsSchema(oficinasFilterSchema)
}
