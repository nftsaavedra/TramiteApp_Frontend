import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
  it('renders correctly', () => {
    render(<Input data-testid="test-input" />)
    
    const input = screen.getByTestId('test-input')
    expect(input).toBeInTheDocument()
  })

  it('forwards ref correctly', () => {
    const refMock = vi.fn()
    render(<Input ref={refMock} data-testid="test-input" />)
    
    expect(refMock).toHaveBeenCalled()
  })

  it('supports different types', () => {
    const { rerender } = render(<Input type="email" data-testid="test-input" />)
    expect(screen.getByTestId('test-input')).toHaveAttribute('type', 'email')
    
    rerender(<Input type="number" data-testid="test-input" />)
    expect(screen.getByTestId('test-input')).toHaveAttribute('type', 'number')
  })

  it('applies custom className', () => {
    render(<Input className="custom-class" data-testid="test-input" />)
    
    const input = screen.getByTestId('test-input')
    expect(input).toHaveClass('custom-class')
  })

  it('can be disabled', () => {
    render(<Input disabled data-testid="test-input" />)
    
    const input = screen.getByTestId('test-input')
    expect(input).toBeDisabled()
  })

  it('supports required attribute', () => {
    render(<Input required data-testid="test-input" />)
    
    const input = screen.getByTestId('test-input')
    expect(input).toHaveAttribute('required')
  })

  it('handles value and onChange', async () => {
    const handleChange = vi.fn()
    render(<Input value="test" onChange={handleChange} data-testid="test-input" />)
    
    const input = screen.getByTestId('test-input')
    expect(input).toHaveValue('test')
    
    const user = userEvent.setup()
    await user.type(input, '123')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('supports placeholder', () => {
    render(<Input placeholder="Enter text" data-testid="test-input" />)
    
    const input = screen.getByTestId('test-input')
    expect(input).toHaveAttribute('placeholder', 'Enter text')
  })

  it('applies aria-invalid styles when invalid', () => {
    render(<Input aria-invalid={true} data-testid="test-input" />)
    
    const input = screen.getByTestId('test-input')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})
