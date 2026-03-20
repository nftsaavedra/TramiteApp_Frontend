import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders correctly with children', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('applies variant styles correctly', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>)
    
    expect(container.firstChild).toHaveClass('bg-destructive')
  })

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>)
    
    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button).toBeDisabled()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    const button = screen.getByRole('button', { name: /click/i })
    await import('@testing-library/user-event').then(({ default: userEvent }) => 
      userEvent.click(button)
    )
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
