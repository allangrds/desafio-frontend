/**
 * @jest-environment node
 */
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import type { SessionData } from '@/types/auth'
import { destroySession, getSession, saveSession } from './session'

jest.mock('iron-session', () => ({
  getIronSession: jest.fn(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('@/constants/session', () => ({
  SESSION_OPTIONS: {},
}))

const mockGetIronSession = getIronSession as jest.MockedFunction<
  typeof getIronSession
>
const mockCookies = cookies as jest.MockedFunction<typeof cookies>

const mockUser: SessionData['user'] = {
  name: 'Test User',
  email: 'test@example.com',
  picture: 'https://example.com/picture.jpg',
  channelTitle: 'Test Channel',
}

const mockTokens: SessionData['tokens'] = {
  accessToken: 'access-token-123',
  refreshToken: 'refresh-token-456',
  expiryDate: 9999999999,
}

function setupCookiesAndSession(sessionData: Record<string, unknown>) {
  const mockCookieStore = {} as Awaited<ReturnType<typeof cookies>>
  mockCookies.mockResolvedValue(mockCookieStore)

  const mockSession = {
    ...sessionData,
    save: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn(),
  } as Record<string, unknown> & {
    save: jest.Mock
    destroy: jest.Mock
  }

  mockGetIronSession.mockResolvedValue(
    mockSession as unknown as Awaited<ReturnType<typeof getIronSession>>,
  )

  return mockSession
}

describe('session', () => {
  describe('getSession', () => {
    it('returns SessionData when session has user and tokens', async () => {
      setupCookiesAndSession({ user: mockUser, tokens: mockTokens })

      const result = await getSession()

      expect(result).toEqual({ user: mockUser, tokens: mockTokens })
    })

    it('returns null when session.user is missing', async () => {
      setupCookiesAndSession({ user: undefined, tokens: mockTokens })

      const result = await getSession()

      expect(result).toBeNull()
    })

    it('returns null when session.tokens is missing', async () => {
      setupCookiesAndSession({ user: mockUser, tokens: undefined })

      const result = await getSession()

      expect(result).toBeNull()
    })
  })

  describe('saveSession', () => {
    it('sets user and tokens on session and calls session.save()', async () => {
      const mockSession = setupCookiesAndSession({})

      await saveSession({ user: mockUser, tokens: mockTokens })

      expect(mockSession.user).toEqual(mockUser)
      expect(mockSession.tokens).toEqual(mockTokens)
      expect(mockSession.save).toHaveBeenCalledTimes(1)
    })
  })

  describe('destroySession', () => {
    it('calls session.destroy()', async () => {
      const mockSession = setupCookiesAndSession({})

      await destroySession()

      expect(mockSession.destroy).toHaveBeenCalledTimes(1)
    })
  })
})
