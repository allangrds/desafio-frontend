import type { SessionData } from '@/types/auth'

export const mockSession = (overrides?: Partial<SessionData>): SessionData => ({
  user: {
    name: 'Test User',
    picture: '',
    email: 'test@example.com',
    channelTitle: 'Test Channel',
  },
  tokens: {
    accessToken: 'mock-access-token',
  },
  ...overrides,
})

export const setupMockSession = (session: SessionData | null): void => {
  const mockGetSession = jest.fn().mockResolvedValue(session)

  jest.mock('@/lib/session', () => ({
    getSession: mockGetSession,
    saveSession: jest.fn().mockResolvedValue(undefined),
    destroySession: jest.fn().mockResolvedValue(undefined),
  }))
}
