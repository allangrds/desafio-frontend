/**
 * @jest-environment node
 */

jest.mock('@/lib/google-apis', () => ({
  oauth2ServerClient: {
    generateAuthUrl: jest.fn(),
  },
}))

jest.mock('@/constants/google', () => ({
  scopes: [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ],
}))

import { scopes } from '@/constants/google'
import { oauth2ServerClient } from '@/lib/google-apis'
import { GET } from './route'

const mockGenerateAuthUrl =
  oauth2ServerClient.generateAuthUrl as jest.MockedFunction<
    typeof oauth2ServerClient.generateAuthUrl
  >

describe('GET /api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGenerateAuthUrl.mockReturnValue(
      'https://accounts.google.com/o/oauth2/auth?fake=1',
    )
  })

  it('returns a redirect response (3xx status)', () => {
    const response = GET()

    expect(response.status).toBeGreaterThanOrEqual(300)
    expect(response.status).toBeLessThan(400)
  })

  it('redirects to the URL returned by generateAuthUrl', () => {
    const fakeUrl = 'https://accounts.google.com/o/oauth2/auth?fake=1'
    mockGenerateAuthUrl.mockReturnValue(fakeUrl)

    const response = GET()

    expect(response.headers.get('location')).toBe(fakeUrl)
  })

  it('calls generateAuthUrl with correct arguments', () => {
    GET()

    expect(mockGenerateAuthUrl).toHaveBeenCalledTimes(1)
    expect(mockGenerateAuthUrl).toHaveBeenCalledWith({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    })
  })
})
