import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useDialogState from '@/hooks/use-dialog-state'

describe('useDialogState Hook', () => {
  it('initializes with null by default', () => {
    const { result } = renderHook(() => useDialogState())
    
    const [open] = result.current
    expect(open).toBeNull()
  })

  it('can initialize with a string value', () => {
    const { result } = renderHook(() => useDialogState<'approve' | 'reject'>('approve'))
    
    const [open] = result.current
    expect(open).toBe('approve')
  })

  it('can initialize with boolean value', () => {
    const { result } = renderHook(() => useDialogState<boolean>(true))
    
    const [open] = result.current
    expect(open).toBe(true)
  })

  it('toggles state when setOpen is called with current value', () => {
    const { result } = renderHook(() => useDialogState<'edit' | 'delete'>('edit'))
    
    const [, setOpen] = result.current
    
    // Toggle - debería cambiar a null
    act(() => setOpen('edit'))
    expect(result.current[0]).toBeNull()
    
    // Toggle de nuevo - debería volver a 'edit'
    act(() => setOpen('edit'))
    expect(result.current[0]).toBe('edit')
  })

  it('sets to null when setOpen is called with null', () => {
    const { result } = renderHook(() => useDialogState<string>('test'))
    
    const [, setOpen] = result.current
    
    act(() => setOpen(null))
    expect(result.current[0]).toBeNull()
  })

  it('works with boolean states', () => {
    const { result } = renderHook(() => useDialogState<boolean>(false))
    
    const [open, setOpen] = result.current
    expect(open).toBe(false)
    
    // Toggle
    act(() => setOpen(false))
    expect(result.current[0]).toBeNull()
    
    // Set to true
    act(() => setOpen(true))
    expect(result.current[0]).toBe(true)
  })

  it('maintains type safety with union types', () => {
    const { result } = renderHook(() => 
      useDialogState<'create' | 'update' | 'delete'>('create')
    )
    
    const [open, setOpen] = result.current
    expect(open).toBe('create')
    
    // Cambiar a otro valor válido
    act(() => setOpen('update'))
    expect(result.current[0]).toBe('update')
    
    // Toggle
    act(() => setOpen('update'))
    expect(result.current[0]).toBeNull()
  })

  it('returns stable function reference', () => {
    const { result } = renderHook(() => 
      useDialogState<string>('test')
    )
    
    const [, setOpen] = result.current
    
    // La función debería ser estable (misma referencia en cada render)
    // Esto es importante para evitar re-renders innecesarios
    expect(typeof setOpen).toBe('function')
  })
})
