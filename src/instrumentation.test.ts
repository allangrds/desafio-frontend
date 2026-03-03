jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
}))

import * as Sentry from '@sentry/nextjs'
import { onRequestError } from './instrumentation'

describe('instrumentation', () => {
  it('calls Sentry.captureException with the error', () => {
    const error = Object.assign(new Error('test'), { digest: 'abc123' })
    const request = { path: '/api/videos', method: 'GET' }
    const context = { routerKind: 'App Router', routePath: '/api/videos' }

    onRequestError(error, request, context)

    expect(Sentry.captureException).toHaveBeenCalledWith(error, {
      extra: { request, context },
    })
  })
})
