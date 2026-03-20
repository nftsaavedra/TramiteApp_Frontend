import { cn } from '@/lib/utils'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Tamaño máximo del container
   * @default 'lg'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

/**
 * Container responsive para layouts consistentes
 * 
 * @example
 * // Uso básico
 * <Container>
 *   <PageContent />
 * </Container>
 * 
 * @example
 * // Con tamaño personalizado
 * <Container size="xl">
 *   <WideContent />
 * </Container>
 * 
 * @example
 * // Con clases adicionales
 * <Container size="lg" className="py-8">
 *   <PaddedContent />
 * </Container>
 */
export function Container({ size = 'lg', className, children }: ContainerProps) {
  return (
    <div
      className={cn(
        // Responsive padding mobile-first
        'w-full px-4 sm:px-6 lg:px-8',
        // Max widths por breakpoint
        {
          'sm:max-w-screen-sm': size === 'sm',
          'md:max-w-screen-md': size === 'md',
          'lg:max-w-screen-lg': size === 'lg',
          'xl:max-w-screen-xl': size === 'xl',
          '2xl:max-w-screen-2xl': size === '2xl',
          'max-w-none': size === 'full',
        },
        // Centrado automático
        'mx-auto',
        className
      )}
    >
      {children}
    </div>
  )
}
