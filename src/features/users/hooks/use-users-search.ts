import { z } from 'zod'
import { useSearchParamsSchema } from '@/hooks/use-search-params-schema'

export const usersFilterSchema = z.object({
  q: z.string().optional(), // Búsqueda global (Nombre, Email)
  page: z.number().catch(1),
  limit: z.number().catch(10),
  sortBy: z.string().optional(),

  // Filtros Específicos
  role: z.array(z.string()).optional(), // Soporta múltiples roles
  activo: z.enum(['true', 'false']).optional(), // Estado ('true' | 'false')
})

export type UsersSearchParams = z.infer<typeof usersFilterSchema>

export function useUsersSearch() {
  return useSearchParamsSchema(usersFilterSchema)
}
