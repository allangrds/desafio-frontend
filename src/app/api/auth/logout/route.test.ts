/**
 * @jest-environment node
 */

jest.mock('@/lib/session', () => ({
  destroySession: jest.fn(),
}))

import { NextRequest } from 'next/server'
import { destroySession } from '@/lib/session'
import { GET } from './route'

const mockDestroySession = destroySession as jest.MockedFunction<
  typeof destroySession
>

describe('GET /api/auth/logout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDestroySession.mockResolvedValue(undefined)
  })

  it('calls destroySession', async () => {
    const request = new NextRequest('http://localhost/api/auth/logout')

    await GET(request)

    expect(mockDestroySession).toHaveBeenCalledTimes(1)
  })

  it('returns a redirect response (3xx status)', async () => {
    const request = new NextRequest('http://localhost/api/auth/logout')

    const response = await GET(request)

    expect(response.status).toBeGreaterThanOrEqual(300)
    expect(response.status).toBeLessThan(400)
  })

  it('redirects to /', async () => {
    const request = new NextRequest('http://localhost/api/auth/logout')

    const response = await GET(request)

    expect(response.headers.get('location')).toBe('http://localhost/')
  })
})
