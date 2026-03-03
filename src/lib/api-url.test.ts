/**
 * @jest-environment node
 */
import { getApiUrl } from './api-url'

describe('getApiUrl', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns baseUrl + path when NEXT_PUBLIC_APP_URL is set', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://my-app.com'

    const result = getApiUrl('/api/videos')

    expect(result).toBe('https://my-app.com/api/videos')
  })

  it('returns https://vercel-url/path when NEXT_PUBLIC_APP_URL is unset, NODE_ENV is production, and VERCEL_URL is set', () => {
    process.env.NEXT_PUBLIC_APP_URL = undefined
    ;(process.env as NodeJS.ProcessEnv & { NODE_ENV: string }).NODE_ENV =
      'production'
    process.env.VERCEL_URL = 'my-app.vercel.app'

    const result = getApiUrl('/api/videos')

    expect(result).toBe('https://my-app.vercel.app/api/videos')
  })

  it('returns http://localhost:3000/path when NEXT_PUBLIC_APP_URL is unset, NODE_ENV is test, and VERCEL_URL is not set', () => {
    process.env.NEXT_PUBLIC_APP_URL = undefined
    ;(process.env as NodeJS.ProcessEnv & { NODE_ENV: string }).NODE_ENV = 'test'
    process.env.VERCEL_URL = undefined

    const result = getApiUrl('/api/videos')

    expect(result).toBe('http://localhost:3000/api/videos')
  })
})
