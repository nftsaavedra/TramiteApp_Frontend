import { z } from 'zod'
import { useSearchParamsSchema } from '@/hooks/use-search-params-schema'

export const tiposDocumentoFilterSchema = z.object({
  q: z.string().optional(), // Búsqueda global (nombre, descripción)
  page: z.number().catch(1),
  limit: z.number().catch(10),
  sortBy: z.string().optional(),
})

export type TiposDocumentoSearchParams = z.infer<typeof tiposDocumentoFilterSchema>

export function useTiposDocumentoSearch() {
  return useSearchParamsSchema(tiposDocumentoFilterSchema)
}
