import { useEffect, useState } from 'react'

/**
 * Hook para detectar preferencia de movimiento reducido
 * 
 * Uso:
 * const prefersReducedMotion = usePrefersReducedMotion()
 * 
 * if (prefersReducedMotion) {
 *   // Deshabilitar animaciones
 * }
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = () => {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

/**
 * Hook para obtener el tipo de transición según preferencia del usuario
 * 
 * @param fast Duración para animaciones rápidas (default: 150ms)
 * @param slow Duración para animaciones lentas (default: 300ms)
 * 
 * @example
 * const transition = useTransitionDuration()
 * // Returns: 'none' si prefiere movimiento reducido, o '150ms'/'300ms'
 */
export function useTransitionDuration(fast = 150): string {
  const prefersReducedMotion = usePrefersReducedMotion()
  
  if (prefersReducedMotion) {
    return 'none'
  }
  
  return `${fast}ms`
}

/**
 * Clase CSS condicional para animaciones
 * 
 * @example
 * <div className={cn(
 *   'transition-all',
 *   !usePrefersReducedMotion() && 'animate-fade-in'
 * )}>
 *   Contenido
 * </div>
 */
export function getMotionClasses(prefersReducedMotion: boolean): string {
  if (prefersReducedMotion) {
    return 'transition-none'
  }
  
  return 'transition-all duration-150'
}
