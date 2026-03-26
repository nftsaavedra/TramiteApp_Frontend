import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIsMobile } from '@/hooks/use-mobile'

describe('useIsMobile Hook', () => {
  const originalMatchMedia = window.matchMedia
  
  beforeEach(() => {
    // Mock de matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
    
    // Mock de window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('returns false for desktop width (>768px)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
  })

  it('returns true for mobile width (<768px)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(true)
  })

  it('handles exact breakpoint boundary (767px)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 767,
    })
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(true)
  })

  it('handles exact breakpoint boundary (768px)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    })
    
    const { result } = renderHook(() => useIsMobile())
    
    expect(result.current).toBe(false)
  })

  it('listens to screen size changes', () => {
    let changeHandler: (() => void) | undefined = undefined
    
    const mockMatchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn((_event, handler: any) => {
        changeHandler = handler
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    
    window.matchMedia = mockMatchMedia
    
    const { result, rerender } = renderHook(() => useIsMobile())
    
    // Debería ser false inicialmente (desktop)
    expect(result.current).toBe(false)
    
    // Simular cambio a mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })
    
    // Actualizar el mock para que retorne el nuevo valor
    mockMatchMedia.mockImplementationOnce((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    
    // Disparar el handler de cambio
    if (changeHandler) {
      ;(changeHandler as () => void)()
    }
    
    // Forzar re-render para actualizar el estado
    rerender()
    
    expect(result.current).toBe(true)
  })

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerMock = vi.fn()
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerMock,
      dispatchEvent: vi.fn(),
    }))
    
    const { unmount } = renderHook(() => useIsMobile())
    
    // Desmontar
    unmount()
    
    // Debería haber llamado a removeEventListener
    expect(removeEventListenerMock).toHaveBeenCalled()
  })
})
