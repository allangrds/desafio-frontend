/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

jest.mock('@/lib/google-apis', () => ({
  oauth2ServerClient: {
    getToken: jest.fn(),
    setCredentials: jest.fn(),
  },
}))

jest.mock('googleapis', () => ({
  google: {
    oauth2: jest.fn(),
    youtube: jest.fn(),
  },
}))

jest.mock('@/lib/session', () => ({
  saveSession: jest.fn(),
  getSession: jest.fn(),
  destroySession: jest.fn(),
}))

import { google } from 'googleapis'
import { oauth2ServerClient } from '@/lib/google-apis'
import { saveSession } from '@/lib/session'
import { GET } from './route'

const mockGetToken = oauth2ServerClient.getToken as jest.MockedFunction<typeof oauth2ServerClient.getToken>
const mockSaveSession = saveSession as jest.MockedFunction<typeof saveSession>
const mockOauth2 = google.oauth2 as jest.MockedFunction<typeof google.oauth2>
const mockYoutube = google.youtube as jest.MockedFunction<typeof google.youtube>

const createRequest = (code?: string): NextRequest => {
  const url = code
    ? `http://localhost:3000/api/auth/callback?code=${code}`
    : 'http://localhost:3000/api/auth/callback'
  return new NextRequest(url)
}

describe('GET /api/auth/callback', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('valid code → saves session and redirects to /', async () => {
    mockGetToken.mockResolvedValue({
      tokens: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expiry_date: 9999999999,
      },
    })

    mockOauth2.mockReturnValue({
      userinfo: {
        get: jest.fn().mockResolvedValue({
          data: {
            name: 'Test User',
            picture: 'https://example.com/photo.jpg',
            email: 'test@example.com',
          },
        }),
      },
    } as unknown as ReturnType<typeof google.oauth2>)

    mockYoutube.mockReturnValue({
      channels: {
        list: jest.fn().mockResolvedValue({
          data: {
            items: [{ snippet: { title: 'Test Channel' } }],
          },
        }),
      },
    } as unknown as ReturnType<typeof google.youtube>)

    const request = createRequest('valid-code')
    const response = await GET(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/')
    expect(mockSaveSession).toHaveBeenCalledWith({
      user: {
        name: 'Test User',
        picture: 'https://example.com/photo.jpg',
        email: 'test@example.com',
        channelTitle: 'Test Channel',
      },
      tokens: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiryDate: 9999999999,
      },
    })
  })

  it('missing code param → returns 400', async () => {
    const request = createRequest()
    const response = await GET(request)

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body).toEqual({ error: 'No authorization code provided' })
  })

  it('getToken throws → returns 500', async () => {
    mockGetToken.mockRejectedValue(new Error('Token exchange failed'))

    const request = createRequest('bad-code')
    const response = await GET(request)

    expect(response.status).toBe(500)
    const body = await response.json()
    expect(body).toEqual({ error: 'Authentication failed' })
  })

  it('youtube.channels.list returns empty items → saveSession called with channelTitle My Channel', async () => {
    mockGetToken.mockResolvedValue({
      tokens: {
        access_token: 'mock-access-token',
        refresh_token: undefined,
        expiry_date: undefined,
      },
    })

    mockOauth2.mockReturnValue({
      userinfo: {
        get: jest.fn().mockResolvedValue({
          data: {
            name: 'Test User',
            picture: '',
            email: 'test@example.com',
          },
        }),
      },
    } as unknown as ReturnType<typeof google.oauth2>)

    mockYoutube.mockReturnValue({
      channels: {
        list: jest.fn().mockResolvedValue({
          data: { items: [] },
        }),
      },
    } as unknown as ReturnType<typeof google.youtube>)

    const request = createRequest('valid-code')
    await GET(request)

    expect(mockSaveSession).toHaveBeenCalledWith(
      expect.objectContaining({
        user: expect.objectContaining({ channelTitle: 'My Channel' }),
      }),
    )
  })
})
