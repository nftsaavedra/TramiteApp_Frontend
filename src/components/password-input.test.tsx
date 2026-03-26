import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PasswordInput } from '@/components/password-input'

describe('PasswordInput Component', () => {
  it('renders correctly with default state (password hidden)', () => {
    render(<PasswordInput data-testid="password-input" />)
    
    const input = screen.getByTestId('password-input')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('toggles password visibility when eye button is clicked', async () => {
    const user = userEvent.setup()
    render(<PasswordInput data-testid="password-input" />)
    
    const input = screen.getByTestId('password-input')
    const toggleButton = screen.getByRole('button')
    
    // Estado inicial: password oculto
    expect(input).toHaveAttribute('type', 'password')
    
    // Click para mostrar password
    await user.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')
    
    // Click para ocultar nuevamente
    await user.click(toggleButton)
    expect(input).toHaveAttribute('type', 'password')
  })

  it('respects disabled prop', () => {
    render(<PasswordInput disabled data-testid="password-input" />)
    
    const input = screen.getByTestId('password-input')
    const toggleButton = screen.getByRole('button')
    
    expect(input).toBeDisabled()
    expect(toggleButton).toBeDisabled()
  })

  it('forwards ref correctly', () => {
    const refMock = vi.fn()
    render(<PasswordInput ref={refMock} data-testid="password-input" />)
    
    expect(refMock).toHaveBeenCalled()
  })

  it('passes through additional props', () => {
    render(
      <PasswordInput 
        data-testid="password-input"
        placeholder="Enter password"
        required
      />
    )
    
    const input = screen.getByTestId('password-input')
    expect(input).toHaveAttribute('placeholder', 'Enter password')
    expect(input).toHaveAttribute('required')
  })

  it('applies custom className', () => {
    const { container } = render(
      <PasswordInput className="custom-class" data-testid="password-input" />
    )
    
    const parent = container.firstChild
    expect(parent).toHaveClass('custom-class')
  })
})
