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
        // UX Adaptativa: Padding con clamp() para transición suave
        'w-full',
        'px-[clamp(1rem,0.75rem+1.25vw,2rem)]',
        // Max widths con clamp() para responsividad sin saltos
        {
          'max-w-[clamp(24rem,20rem+20vw,40rem)]': size === 'sm',
          'max-w-[clamp(40rem,35rem+25vw,48rem)]': size === 'md',
          'max-w-[clamp(48rem,40rem+30vw,64rem)]': size === 'lg',
          'max-w-[clamp(64rem,55rem+35vw,80rem)]': size === 'xl',
          'max-w-[clamp(80rem,70rem+40vw,96rem)]': size === '2xl',
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
