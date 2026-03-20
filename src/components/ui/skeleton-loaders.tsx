import { Skeleton } from './skeleton'

interface TableSkeletonProps {
  /**
   * Número de filas a mostrar
   * @default 5
   */
  rows?: number
  /**
   * Número de columnas estimadas
   * @default 6
   */
  columns?: number
}

/**
 * Skeleton para tablas de datos
 * 
 * @example
 * // Uso básico
 * {isLoading && <TableSkeleton rows={10} />}
 */
export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
  return (
    <div className="w-full space-y-3">
      {/* Header skeleton */}
      <div className="flex w-full gap-2 border-b pb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={`header-${i}`}
            className="h-4 flex-1"
            style={{ maxWidth: `${100 / columns}%` }}
          />
        ))}
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex w-full gap-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`row-${rowIndex}-col-${colIndex}`}
              className="h-8 flex-1"
              style={{ maxWidth: `${100 / columns}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

interface CardSkeletonProps {
  /**
   * Número de cards a mostrar en grid
   * @default 3
   */
  count?: number
  /**
   * Altura del contenido
   * @default 'h-32'
   */
  contentHeight?: string
}

/**
 * Skeleton para cards en grid
 * 
 * @example
 * // Mostrar 6 cards
 * {isLoading && <CardSkeleton count={6} />}
 */
export function CardSkeleton({ count = 3, contentHeight = 'h-32' }: CardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-lg border p-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className={`${contentHeight} w-full`} />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface PageSkeletonProps {
  /**
   * Incluir header de página
   * @default true
   */
  includeHeader?: boolean
  /**
   * Número de líneas de contenido
   * @default 3
   */
  contentLines?: number
}

/**
 * Skeleton para páginas completas
 * 
 * @example
 * // Página con header y contenido
 * {isLoading && <PageSkeleton includeHeader />}
 */
export function PageSkeleton({ includeHeader = true, contentLines = 3 }: PageSkeletonProps) {
  return (
    <div className="space-y-6 p-6">
      {includeHeader && (
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      
      {/* Content blocks */}
      {Array.from({ length: contentLines }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  )
}

interface FormSkeletonProps {
  /**
   * Número de campos del formulario
   * @default 4
   */
  fields?: number
  /**
   * Incluir botón de submit
   * @default true
   */
  includeSubmit?: boolean
}

/**
 * Skeleton para formularios
 * 
 * @example
 * // Formulario con 6 campos
 * {isLoading && <FormSkeleton fields={6} />}
 */
export function FormSkeleton({ fields = 4, includeSubmit = true }: FormSkeletonProps) {
  return (
    <div className="space-y-4 p-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      
      {includeSubmit && (
        <div className="pt-4">
          <Skeleton className="h-10 w-full sm:w-40" />
        </div>
      )}
    </div>
  )
}

interface ListSkeletonProps {
  /**
   * Número de items de la lista
   * @default 5
   */
  items?: number
  /**
   * Altura de cada item
   * @default 'h-16'
   */
  itemHeight?: string
}

/**
 * Skeleton para listas verticales
 * 
 * @example
 * // Lista de 10 items
 * {isLoading && <ListSkeleton items={10} />}
 */
export function ListSkeleton({ items = 5, itemHeight = 'h-16' }: ListSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: items }).map((_, i) => (
        <Skeleton key={i} className={`${itemHeight} w-full`} />
      ))}
    </div>
  )
}
