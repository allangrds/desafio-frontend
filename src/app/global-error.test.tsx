import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import GlobalError from './global-error'

jest.mock('@sentry/nextjs', () => ({ captureException: jest.fn() }))

describe('GlobalError boundary (src/app/global-error.tsx)', () => {
  const mockReset = jest.fn()
  const testError = Object.assign(new globalThis.Error('Global error'), {
    digest: 'xyz789',
  }) as Error & { digest?: string }

  it('renders the fallback UI without crashing', () => {
    const { container } = render(
      <GlobalError error={testError} reset={mockReset} />,
    )
    expect(container).toBeTruthy()
  })

  it('renders a fallback message', () => {
    render(<GlobalError error={testError} reset={mockReset} />)
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('renders retry button that calls reset', async () => {
    render(<GlobalError error={testError} reset={mockReset} />)

    const button = screen.getByRole('button', { name: /try again/i })
    await userEvent.click(button)

    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('renders a home link pointing to "/"', () => {
    render(<GlobalError error={testError} reset={mockReset} />)

    const link = screen.getByRole('link', { name: /go home/i })
    expect(link).toHaveAttribute('href', '/')
  })
})
