'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error for debugging (in production, send to monitoring service like Sentry)
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <AlertCircle className="h-16 w-16 text-destructive" />

      <div className="text-center space-y-3 max-w-md">
        <h2 className="text-2xl font-bold">Oops! Something went wrong</h2>
        <p className="text-muted-foreground">
          We couldn't load the content. Please try again in a few moments.
        </p>
      </div>

      <Button onClick={reset} size="lg">
        Try again
      </Button>
    </div>
  )
}
