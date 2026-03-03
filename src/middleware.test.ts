/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { middleware } from './middleware'

function makeRequest(
  path: string,
  ip?: string,
  forwardedFor?: string,
): NextRequest {
  const url = `http://localhost${path}`
  const headers: Record<string, string> = {}
  if (forwardedFor) headers['x-forwarded-for'] = forwardedFor
  if (ip) headers['x-real-ip'] = ip
  return new NextRequest(url, { headers })
}

describe('middleware - rate limiting', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('allows requests below the threshold and adds X-RateLimit headers', async () => {
    const req = makeRequest('/api/videos', undefined, '1.2.3.4')
    const response = await middleware(req)

    expect(response.status).not.toBe(429)
    expect(response.headers.get('X-RateLimit-Limit')).toBeDefined()
    expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined()
    expect(response.headers.get('X-RateLimit-Reset')).toBeDefined()
  })

  it('returns 429 with correct headers when threshold exceeded', async () => {
    const ip = '10.0.0.1'
    let response = null

    // signin limit is 20 req / 60s — hit it 21 times
    for (let i = 0; i <= 20; i++) {
      const req = makeRequest('/api/auth/signin', undefined, ip)
      response = await middleware(req)
    }

    expect(response?.status).toBe(429)
    expect(response?.headers.get('Retry-After')).toBeDefined()
    expect(response?.headers.get('X-RateLimit-Limit')).toBe('20')
    expect(response?.headers.get('X-RateLimit-Remaining')).toBe('0')
    expect(response?.headers.get('X-RateLimit-Reset')).toBeDefined()

    const body = await response?.json()
    expect(body).toEqual({ error: 'Too Many Requests' })
  })

  it('does not rate limit non-API paths', async () => {
    const req = makeRequest('/', undefined, '192.168.1.1')
    const response = await middleware(req)

    // non-API paths should not be intercepted
    expect(response.headers.get('X-RateLimit-Limit')).toBeNull()
  })

  it('gives different IPs independent counters', async () => {
    const ip1 = '5.5.5.5'
    const ip2 = '6.6.6.6'

    // Exhaust ip1's limit for /api/auth/signin (20 requests)
    for (let i = 0; i < 20; i++) {
      await middleware(makeRequest('/api/auth/signin', undefined, ip1))
    }
    const blockedResponse = await middleware(
      makeRequest('/api/auth/signin', undefined, ip1),
    )
    expect(blockedResponse.status).toBe(429)

    // ip2 should still be allowed
    const allowedResponse = await middleware(
      makeRequest('/api/auth/signin', undefined, ip2),
    )
    expect(allowedResponse.status).not.toBe(429)
  })

  it('applies route-specific limits: signin uses 20 req limit', async () => {
    const ip = '7.7.7.7'
    let lastResponse = null

    for (let i = 0; i <= 20; i++) {
      lastResponse = await middleware(
        makeRequest('/api/auth/signin', undefined, ip),
      )
    }

    expect(lastResponse?.status).toBe(429)
    expect(lastResponse?.headers.get('X-RateLimit-Limit')).toBe('20')
  })

  it('applies route-specific limits: videos uses 60 req limit', async () => {
    const ip = '8.8.8.8'
    let lastResponse = null

    // 60 requests should all be allowed
    for (let i = 0; i < 60; i++) {
      lastResponse = await middleware(makeRequest('/api/videos', undefined, ip))
    }
    expect(lastResponse?.status).not.toBe(429)

    // 61st should be blocked
    lastResponse = await middleware(makeRequest('/api/videos', undefined, ip))
    expect(lastResponse?.status).toBe(429)
    expect(lastResponse?.headers.get('X-RateLimit-Limit')).toBe('60')
  })

  it('uses x-real-ip when x-forwarded-for is absent', async () => {
    const ip = '9.9.9.9'
    const req = makeRequest('/api/auth/signin', ip)
    const response = await middleware(req)
    expect(response.status).not.toBe(429)
    expect(response.headers.get('X-RateLimit-Remaining')).toBeDefined()
  })
})
