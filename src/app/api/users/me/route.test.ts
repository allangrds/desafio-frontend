/**
 * @jest-environment node
 */

jest.mock('@/lib/session', () => ({
  getSession: jest.fn(),
}))

import { getSession } from '@/lib/session'
import { GET } from './route'

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>

describe('GET /api/users/me', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('authenticated: returns 200 with user and tokens', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        name: 'Test',
        email: 'test@example.com',
        picture: 'https://example.com/photo.jpg',
        channelTitle: 'Test Channel',
      },
      tokens: {
        accessToken: 'tok',
        refreshToken: 'refresh-tok',
        expiryDate: 9999999999,
      },
    })

    const response = await GET()

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual({
      user: {
        name: 'Test',
        email: 'test@example.com',
        picture: 'https://example.com/photo.jpg',
        channelTitle: 'Test Channel',
      },
      tokens: {
        accessToken: 'tok',
      },
    })
  })

  it('authenticated: response body does not include refreshToken or expiryDate', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        name: 'Test',
        email: 'test@example.com',
        picture: '',
        channelTitle: 'My Channel',
      },
      tokens: {
        accessToken: 'tok',
        refreshToken: 'secret-refresh',
        expiryDate: 1234567890,
      },
    })

    const response = await GET()
    const body = await response.json()

    expect(body.tokens).not.toHaveProperty('refreshToken')
    expect(body.tokens).not.toHaveProperty('expiryDate')
  })

  it('unauthenticated: getSession returns null → response is 401', async () => {
    mockGetSession.mockResolvedValue(null)

    const response = await GET()

    expect(response.status).toBe(401)
  })

  it('unauthenticated: getSession returns null → response body is { error: "Not authenticated" }', async () => {
    mockGetSession.mockResolvedValue(null)

    const response = await GET()
    const body = await response.json()

    expect(body).toEqual({ error: 'Not authenticated' })
  })
})
