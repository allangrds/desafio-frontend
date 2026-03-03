import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  // NOTE: Do NOT include captureConsole integration — only boundary-caught
  // and unhandled exceptions/rejections are monitored (per FR-028)
})
