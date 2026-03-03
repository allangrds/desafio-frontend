import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('renders with default classes', () => {
    render(<Skeleton data-testid="skeleton" />)
    const el = screen.getByTestId('skeleton')
    expect(el).toBeInTheDocument()
    expect(el).toHaveAttribute('data-slot', 'skeleton')
  })

  it('merges custom className', () => {
    render(<Skeleton data-testid="skeleton" className="h-10 w-20" />)
    const el = screen.getByTestId('skeleton')
    expect(el).toHaveClass('h-10')
    expect(el).toHaveClass('w-20')
  })

  it('passes through additional props', () => {
    render(<Skeleton data-testid="skeleton" aria-label="loading" />)
    expect(screen.getByTestId('skeleton')).toHaveAttribute(
      'aria-label',
      'loading',
    )
  })
})
