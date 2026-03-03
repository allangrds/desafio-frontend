'use client'

import * as Sentry from '@sentry/nextjs'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { Button } from '@/components/ui/button'

// biome-ignore lint/suspicious/noShadowRestrictedNames: Next.js Error component pattern
const Error = ({
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <AlertCircle className="h-16 w-16 text-destructive" />

      <div className="text-center space-y-3 max-w-md">
        <h2 className="text-2xl font-bold">Search failed</h2>
        <p className="text-muted-foreground">
          Search failed — try again or go back to home.
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={reset} size="lg">
          Try again
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  )
}

export default Error
