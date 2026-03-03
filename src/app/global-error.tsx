'use client'

import * as Sentry from '@sentry/nextjs'
import * as React from 'react'

const GlobalError = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  React.useEffect(() => {
    Sentry.captureException(error, { extra: { digest: error.digest } })
  }, [error])

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            padding: '1rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Something went wrong
          </h2>
          <p
            style={{ color: '#6b7280', textAlign: 'center', maxWidth: '28rem' }}
          >
            A critical error occurred. Please try again or return to the home
            page.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: '0.5rem 1.25rem',
                background: '#111827',
                color: '#fff',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                padding: '0.5rem 1.25rem',
                background: 'transparent',
                color: '#111827',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}

export default GlobalError
