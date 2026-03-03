import LRUCache from 'lru-cache'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

type RateLimitEntry = {
  count: number
  resetAt: number
}

const WINDOW_MS = 60 * 1000 // 60 seconds

const ROUTE_LIMITS: { pattern: RegExp; limit: number }[] = [
  { pattern: /^\/api\/auth\/signin/, limit: 20 },
  { pattern: /^\/api\/auth\/register/, limit: 20 },
  { pattern: /^\/api\/auth\/callback/, limit: 30 },
  { pattern: /^\/api\/auth\/logout/, limit: 30 },
  { pattern: /^\/api\/videos/, limit: 60 },
  { pattern: /^\/api\/users/, limit: 60 },
]

const DEFAULT_LIMIT = 30

function getRouteLimit(pathname: string): number {
  for (const { pattern, limit } of ROUTE_LIMITS) {
    if (pattern.test(pathname)) return limit
  }
  return DEFAULT_LIMIT
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp
  return '127.0.0.1'
}

const cache = new LRUCache<string, RateLimitEntry>({ max: 10000 })

function getRateLimitKey(ip: string, pathname: string): string {
  // Key by IP + route bucket (not full dynamic path)
  for (const { pattern } of ROUTE_LIMITS) {
    if (pattern.test(pathname)) {
      const bucket = pattern.source.replace(/\\/g, '').replace(/\^/, '')
      return `${ip}:${bucket}`
    }
  }
  return `${ip}:default`
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // Only rate limit API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const ip = getClientIp(request)
  const limit = getRouteLimit(pathname)
  const key = getRateLimitKey(ip, pathname)
  const now = Date.now()

  let entry = cache.get(key)

  if (!entry || now >= entry.resetAt) {
    entry = { count: 0, resetAt: now + WINDOW_MS }
    cache.set(key, entry)
  }

  entry.count++
  cache.set(key, entry)

  const remaining = Math.max(0, limit - entry.count)
  const resetSec = Math.ceil(entry.resetAt / 1000)
  const retryAfter = Math.ceil((entry.resetAt - now) / 1000)

  if (entry.count > limit) {
    return NextResponse.json(
      { error: 'Too Many Requests' },
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(resetSec),
        },
      },
    )
  }

  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', String(limit))
  response.headers.set('X-RateLimit-Remaining', String(remaining))
  response.headers.set('X-RateLimit-Reset', String(resetSec))
  return response
}

export const config = {
  matcher: ['/api/:path*'],
}
