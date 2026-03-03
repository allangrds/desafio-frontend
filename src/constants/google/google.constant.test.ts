import { scopes } from './google.constant'

describe('google.constant', () => {
  it('exports scopes array', () => {
    expect(Array.isArray(scopes)).toBe(true)
    expect(scopes.length).toBeGreaterThan(0)
  })

  it('includes youtube readonly scope', () => {
    expect(scopes).toContain('https://www.googleapis.com/auth/youtube.readonly')
  })

  it('includes youtube upload scope', () => {
    expect(scopes).toContain('https://www.googleapis.com/auth/youtube.upload')
  })

  it('includes userinfo profile scope', () => {
    expect(scopes).toContain('https://www.googleapis.com/auth/userinfo.profile')
  })

  it('includes userinfo email scope', () => {
    expect(scopes).toContain('https://www.googleapis.com/auth/userinfo.email')
  })
})
