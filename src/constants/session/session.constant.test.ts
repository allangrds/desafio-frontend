import { SESSION_OPTIONS } from './session.constant'

describe('session.constant', () => {
  it('exports SESSION_OPTIONS', () => {
    expect(SESSION_OPTIONS).toBeDefined()
  })

  it('has a cookieName', () => {
    expect(SESSION_OPTIONS.cookieName).toBe('youtube_auth_session')
  })

  it('has a password', () => {
    expect(typeof SESSION_OPTIONS.password).toBe('string')
    expect(SESSION_OPTIONS.password.length).toBeGreaterThan(0)
  })

  it('has cookieOptions with httpOnly true', () => {
    expect(SESSION_OPTIONS.cookieOptions.httpOnly).toBe(true)
  })

  it('has a maxAge', () => {
    expect(SESSION_OPTIONS.cookieOptions.maxAge).toBeGreaterThan(0)
  })
})
