import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/hooks/use-debounce'

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500))
    
    expect(result.current).toBe('test')
  })

  it('debounces value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    )
    
    expect(result.current).toBe('initial')
    
    // Cambiar el valor
    act(() => {
      rerender({ value: 'updated' })
    })
    
    // Avanzar el tiempo completamente
    act(() => {
      vi.advanceTimersByTime(400)
    })
    
    // Ahora debería haber actualizado
    expect(result.current).toBe('updated')
  })

  it('uses default delay when not provided', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'test' } }
    )
    
    act(() => {
      rerender({ value: 'updated' })
    })
    
    expect(result.current).toBe('test')
    
    // Default delay is 500ms
    act(() => {
      vi.advanceTimersByTime(600)
    })
    
    expect(result.current).toBe('updated')
  })

  it('cancels previous timeout when value changes rapidly', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'first' } }
    )
    
    // Primer cambio
    act(() => {
      rerender({ value: 'second' })
    })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    
    // Segundo cambio (cancela el anterior)
    act(() => {
      rerender({ value: 'third' })
    })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    
    // Todavía no debería haber actualizado
    expect(result.current).toBe('first')
    
    // Completar el último delay
    act(() => {
      vi.advanceTimersByTime(400)
    })
    
    expect(result.current).toBe('third')
  })

  it('works with different value types', async () => {
    // Con números
    const { result: numberResult, rerender: numberRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 0 } }
    )
    
    act(() => {
      numberRerender({ value: 42 })
    })
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(numberResult.current).toBe(42)
    
    // Con objetos
    const obj1 = { name: 'test' }
    const obj2 = { name: 'updated' }
    
    const { result: objResult, rerender: objRerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: obj1 } }
    )
    
    act(() => {
      objRerender({ value: obj2 })
    })
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(objResult.current).toEqual(obj2)
  })
})
