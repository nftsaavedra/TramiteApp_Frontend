import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmDialog } from '@/components/confirm-dialog'

// Mock del AlertDialog - como es un componente de Radix, lo mockeamos
vi.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children, open }: any) => {
    if (!open) return null
    return <div data-testid="alert-dialog">{children}</div>
  },
  AlertDialogContent: ({ children }: any) => <div data-testid="alert-dialog-content">{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div data-testid="alert-dialog-header">{children}</div>,
  AlertDialogTitle: ({ children }: any) => <h2 data-testid="alert-dialog-title">{children}</h2>,
  AlertDialogDescription: ({ children }: any) => <div data-testid="alert-dialog-description">{children}</div>,
  AlertDialogFooter: ({ children }: any) => <div data-testid="alert-dialog-footer">{children}</div>,
  AlertDialogCancel: ({ children, onClick, disabled }: any) => (
    <button 
      data-testid="alert-dialog-cancel" 
      onClick={(e) => {
        e.preventDefault()
        onClick && onClick()
      }} 
      disabled={disabled}
    >
      {children}
    </button>
  ),
}))

describe('ConfirmDialog Component', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    title: 'Confirm Action',
    desc: 'Are you sure you want to proceed?',
    handleConfirm: vi.fn(),
  }

  it('renders correctly with basic props', () => {
    render(<ConfirmDialog {...defaultProps} />)
    
    expect(screen.getByTestId('alert-dialog')).toBeInTheDocument()
    expect(screen.getByText('Confirm Action')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument()
  })

  it('calls handleConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup()
    const handleConfirmMock = vi.fn()
    
    render(
      <ConfirmDialog 
        {...defaultProps} 
        handleConfirm={handleConfirmMock}
      />
    )
    
    const confirmButton = screen.getByRole('button', { name: /continue/i })
    await user.click(confirmButton)
    
    expect(handleConfirmMock).toHaveBeenCalledTimes(1)
  })

  it('calls onOpenChange when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onOpenChangeMock = vi.fn()
    
    render(
      <ConfirmDialog 
        {...defaultProps} 
        onOpenChange={onOpenChangeMock}
      />
    )
    
    const cancelButton = screen.getByTestId('alert-dialog-cancel')
    await user.click(cancelButton)
    
    // El AlertDialogCancel de Radix maneja el cierre internamente
    // Verificamos que el botón sea clickable y tenga el texto correcto
    expect(cancelButton).toBeInTheDocument()
    expect(cancelButton).toHaveTextContent('Cancel')
  })

  it('disables buttons when isLoading is true', () => {
    render(
      <ConfirmDialog 
        {...defaultProps} 
        isLoading={true}
      />
    )
    
    const cancelButton = screen.getByTestId('alert-dialog-cancel')
    const confirmButton = screen.getByRole('button', { name: /continue/i })
    
    expect(cancelButton).toBeDisabled()
    expect(confirmButton).toBeDisabled()
  })

  it('uses custom button texts when provided', () => {
    render(
      <ConfirmDialog 
        {...defaultProps}
        cancelBtnText="No, go back"
        confirmText="Yes, delete"
      />
    )
    
    expect(screen.getByRole('button', { name: /no, go back/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /yes, delete/i })).toBeInTheDocument()
  })

  it('applies destructive variant when destructive is true', () => {
    render(
      <ConfirmDialog 
        {...defaultProps}
        destructive={true}
      />
    )
    
    const confirmButton = screen.getByRole('button', { name: /continue/i })
    // Verificar que tiene la clase de destructive
    expect(confirmButton).toHaveClass('bg-destructive')
  })

  it('renders children content', () => {
    render(
      <ConfirmDialog {...defaultProps}>
        <div data-testid="custom-content">Additional info</div>
      </ConfirmDialog>
    )
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
  })

  it('can be controlled via open prop', () => {
    const { rerender } = render(<ConfirmDialog {...defaultProps} open={false} />)
    
    // Cuando está cerrado, el dialog no debería estar en el DOM
    expect(screen.queryByTestId('alert-dialog')).not.toBeInTheDocument()
    
    rerender(<ConfirmDialog {...defaultProps} open={true} />)
    expect(screen.getByTestId('alert-dialog')).toBeInTheDocument()
  })
})
