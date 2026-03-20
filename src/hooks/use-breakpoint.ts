import { useEffect, useState } from 'react'

interface Breakpoint {
  sm: boolean  // >= 640px (mobile landscape)
  md: boolean  // >= 768px (tablet portrait)
  lg: boolean  // >= 1024px (tablet landscape)
  xl: boolean  // >= 1280px (desktop small)
  '2xl': boolean // >= 1536px (desktop large)
}

/**
 * Hook para detectar breakpoints actuales
 * Retorna estado de todos los breakpoints
 * 
 * @example
 * function ResponsiveComponent() {
 *   const breakpoint = useBreakpoint()
 *   
 *   return (
 *     <div>
 *       {breakpoint.sm && <p>Móvil o mayor</p>}
 *       {breakpoint.lg && <p>Desktop pequeño</p>}
 *       {breakpoint.xl && <p>Desktop grande</p>}
 *     </div>
 *   )
 * }
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>({
    sm: false,
    md: false,
    lg: false,
    xl: false,
    '2xl': false,
  })

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth
      
      setBreakpoint({
        sm: width >= 640,
        md: width >= 768,
        lg: width >= 1024,
        xl: width >= 1280,
        '2xl': width >= 1536,
      })
    }

    // Check inicial
    checkBreakpoint()

    // Escuchar cambios de tamaño
    window.addEventListener('resize', checkBreakpoint)
    
    return () => window.removeEventListener('resize', checkBreakpoint)
  }, [])

  return breakpoint
}

/**
 * Hook para verificar si está en un breakpoint específico
 * 
 * @param breakpoint - 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 * 
 * @example
 * function MobileOnlyComponent() {
 *   const isMobile = useIsBreakpoint('sm')
 *   return isMobile ? <MobileView /> : <DesktopView />
 * }
 */
export function useIsBreakpoint(breakpoint: keyof Omit<Breakpoint, 'sm'>): boolean {
  const current = useBreakpoint()
  
  switch (breakpoint) {
    case 'md':
      return current.md
    case 'lg':
      return current.lg
    case 'xl':
      return current.xl
    case '2xl':
      return current['2xl']
    default:
      return false
  }
}

/**
 * Hook para obtener el breakpoint actual como string
 * Útil para debugging o logging
 * 
 * @example
 * function DebugComponent() {
 *   const currentBreakpoint = useCurrentBreakpoint()
 *   return <div>Current: {currentBreakpoint}</div>
 * }
 */
export function useCurrentBreakpoint(): string {
  const breakpoint = useBreakpoint()
  
  if (breakpoint['2xl']) return '2xl'
  if (breakpoint.xl) return 'xl'
  if (breakpoint.lg) return 'lg'
  if (breakpoint.md) return 'md'
  if (breakpoint.sm) return 'sm'
  return 'xs'
}
