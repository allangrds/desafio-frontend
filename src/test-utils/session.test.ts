import { mockSession, setupMockSession } from './session'

describe('test-utils/session', () => {
  describe('mockSession', () => {
    it('returns default session data', () => {
      const session = mockSession()

      expect(session.user.name).toBe('Test User')
      expect(session.user.email).toBe('test@example.com')
      expect(session.tokens.accessToken).toBe('mock-access-token')
    })

    it('applies overrides to the session', () => {
      const session = mockSession({
        user: {
          name: 'Override User',
          picture: 'pic.jpg',
          email: 'override@example.com',
          channelTitle: 'My Channel',
        },
      })

      expect(session.user.name).toBe('Override User')
      expect(session.tokens.accessToken).toBe('mock-access-token')
    })

    it('applies token overrides', () => {
      const session = mockSession({ tokens: { accessToken: 'new-token' } })

      expect(session.tokens.accessToken).toBe('new-token')
    })
  })

  describe('setupMockSession', () => {
    it('can be called without throwing', () => {
      expect(() => setupMockSession(null)).not.toThrow()
    })

    it('can be called with a session without throwing', () => {
      const session = mockSession()
      expect(() => setupMockSession(session)).not.toThrow()
    })
  })
})
