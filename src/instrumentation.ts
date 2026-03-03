import * as Sentry from '@sentry/nextjs'

export function onRequestError(
  error: { digest: string } & Error,
  request: { path: string; method: string },
  context: { routerKind: string; routePath: string },
): void {
  Sentry.captureException(error, { extra: { request, context } })
}
