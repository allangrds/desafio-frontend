/** @jest-environment node */
jest.mock('@/lib/session', () => ({
  saveSession: jest.fn().mockResolvedValue(undefined),
  destroySession: jest.fn().mockResolvedValue(undefined),
}))

import { NextRequest } from 'next/server'
import { destroySession, saveSession } from '@/lib/session'
import { DELETE, POST } from './route'

describe('api/test/session route', () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
      configurable: true,
    })
  })

  describe('POST', () => {
    it('returns 404 in production', async () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true,
      })

      const req = new NextRequest('http://localhost/api/test/session', {
        method: 'POST',
        body: JSON.stringify({ user: null, tokens: { accessToken: '' } }),
      })

      const res = await POST(req)
      expect(res.status).toBe(404)
    })

    it('saves session in non-production environment', async () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'test',
        writable: true,
        configurable: true,
      })

      const sessionData = {
        user: {
          name: 'Test',
          email: 'test@test.com',
          picture: '',
          channelTitle: '',
        },
        tokens: { accessToken: 'tok' },
      }

      const req = new NextRequest('http://localhost/api/test/session', {
        method: 'POST',
        body: JSON.stringify(sessionData),
      })

      const res = await POST(req)
      const body = await res.json()

      expect(body).toEqual({ ok: true })
      expect(saveSession).toHaveBeenCalledWith(sessionData)
    })
  })

  describe('DELETE', () => {
    it('returns 404 in production', async () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true,
      })

      const res = await DELETE()
      expect(res.status).toBe(404)
    })

    it('destroys session in non-production environment', async () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'test',
        writable: true,
        configurable: true,
      })

      const res = await DELETE()
      const body = await res.json()

      expect(body).toEqual({ ok: true })
      expect(destroySession).toHaveBeenCalled()
    })
  })
})
