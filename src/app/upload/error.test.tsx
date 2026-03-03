import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import UploadError from './error'

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

describe('Upload Error boundary (src/app/upload/error.tsx)', () => {
  const mockReset = jest.fn()
  const testError = new Error('Upload failed') as Error & { digest?: string }

  it('renders upload-specific error message', () => {
    render(<UploadError error={testError} reset={mockReset} />)

    expect(
      screen.getByRole('heading', { name: /upload failed/i }),
    ).toBeInTheDocument()
  })

  it('renders "Try again" button that calls reset', async () => {
    render(<UploadError error={testError} reset={mockReset} />)

    const button = screen.getByRole('button', { name: /try again/i })
    await userEvent.click(button)

    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('renders a "Go home" link pointing to "/"', () => {
    render(<UploadError error={testError} reset={mockReset} />)

    const link = screen.getByRole('link', { name: /go home/i })
    expect(link).toHaveAttribute('href', '/')
  })
})
