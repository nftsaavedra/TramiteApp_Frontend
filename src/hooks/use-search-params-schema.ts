import { useMemo } from 'react'
import { z } from 'zod'
import { useSearch } from '@tanstack/react-router'

export function useSearchParamsSchema<T extends z.ZodType>(schema: T) {
  // 'strict: false' permite leer params desde cualquier ruta sin validación estricta de ruta
  const search = useSearch({ strict: false })

  const params = useMemo(() => {
    const result = schema.safeParse(search)
    if (!result.success) {
      console.warn('⚠️ Error validando params URL:', result.error)
      return {} as z.infer<T>
    }
    return result.data as z.infer<T>
  }, [search, schema])

  return params
}
