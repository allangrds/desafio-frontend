import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Spinner } from './spinner'

describe('Spinner', () => {
  it('renders with aria-label "Loading"', () => {
    render(<Spinner />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    render(<Spinner className="text-red-500" />)
    const el = screen.getByLabelText('Loading')
    expect(el).toHaveClass('text-red-500')
  })

  it('passes through additional svg props', () => {
    render(<Spinner data-testid="spinner" />)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })
})
