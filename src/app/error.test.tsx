import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import AppError from './error'

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

describe('Error boundary (src/app/error.tsx)', () => {
  const mockReset = jest.fn()
  const testError = Object.assign(
    new globalThis.Error('Something went wrong'),
    {
      digest: 'abc123',
    },
  ) as Error & { digest?: string }

  it('renders "Try again" button and calls reset on click', async () => {
    render(<AppError error={testError} reset={mockReset} />)

    const button = screen.getByRole('button', { name: /try again/i })
    await userEvent.click(button)

    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('renders a "Go home" link pointing to "/"', () => {
    render(<AppError error={testError} reset={mockReset} />)

    const link = screen.getByRole('link', { name: /go home/i })
    expect(link).toHaveAttribute('href', '/')
  })
})
