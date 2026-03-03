import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import AuthError from './error'

jest.mock('@sentry/nextjs', () => ({ captureException: jest.fn() }))

jest.mock('next/link', () => {
  const MockLink = ({
    href,
    children,
  }: {
    href: string
    children: React.ReactNode
  }) => <a href={href}>{children}</a>
  MockLink.displayName = 'MockLink'
  return MockLink
})

describe('Auth Error boundary (src/app/auth/error.tsx)', () => {
  const mockReset = jest.fn()
  const testError = new Error('Auth failed') as Error & { digest?: string }

  it('renders auth-specific error message', () => {
    render(<AuthError error={testError} reset={mockReset} />)

    expect(
      screen.getByRole('heading', { name: /authentication failed/i }),
    ).toBeInTheDocument()
  })

  it('renders "Try again" button that calls reset', async () => {
    render(<AuthError error={testError} reset={mockReset} />)

    const button = screen.getByRole('button', { name: /try again/i })
    await userEvent.click(button)

    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('renders a "Go home" link pointing to "/"', () => {
    render(<AuthError error={testError} reset={mockReset} />)

    const link = screen.getByRole('link', { name: /go home/i })
    expect(link).toHaveAttribute('href', '/')
  })
})
