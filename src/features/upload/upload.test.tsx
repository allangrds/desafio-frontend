import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

const mockRedirect = jest.fn()

jest.mock('iron-session', () => ({
  getIronSession: jest.fn(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
}))

jest.mock('@/constants/session', () => ({
  SESSION_OPTIONS: { password: 'test', cookieName: 'test' },
}))

jest.mock('@/components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div data-testid="skeleton" className={className} />
  ),
}))

jest.mock('./components/user-menu', () => ({
  UserMenu: () => <div data-testid="user-menu" />,
}))

jest.mock('./upload.container', () => ({
  UploadContainer: ({ userMenuSlot }: { userMenuSlot: React.ReactNode }) => (
    <div data-testid="upload-container">
      <div data-testid="user-menu-slot">{userMenuSlot}</div>
    </div>
  ),
}))

import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { Upload } from './upload'

describe('Upload (server component)', () => {
  const mockGetIronSession = getIronSession as jest.Mock
  const mockCookies = cookies as jest.Mock

  beforeEach(() => {
    mockCookies.mockResolvedValue({})
    mockRedirect.mockClear()
  })

  it('redirects to signin when session has no user', async () => {
    mockGetIronSession.mockResolvedValue({})

    try {
      await Upload()
    } catch {
      // redirect throws in some environments
    }

    expect(mockRedirect).toHaveBeenCalledWith('/auth/signin')
  })

  it('redirects to signin when session has user but no tokens', async () => {
    mockGetIronSession.mockResolvedValue({
      user: { name: 'Alice', email: 'a@a.com', picture: '', channelTitle: '' },
    })

    try {
      await Upload()
    } catch {
      // redirect throws in some environments
    }

    expect(mockRedirect).toHaveBeenCalledWith('/auth/signin')
  })

  it('renders UploadContainer when session is valid', async () => {
    mockGetIronSession.mockResolvedValue({
      user: { name: 'Alice', email: 'a@a.com', picture: '', channelTitle: '' },
      tokens: { accessToken: 'token' },
    })

    const component = await Upload()
    render(component)

    expect(screen.getByTestId('upload-container')).toBeInTheDocument()
  })

  it('includes user menu slot when session is valid', async () => {
    mockGetIronSession.mockResolvedValue({
      user: { name: 'Alice', email: 'a@a.com', picture: '', channelTitle: '' },
      tokens: { accessToken: 'token' },
    })

    const component = await Upload()
    render(component)

    expect(screen.getByTestId('user-menu-slot')).toBeInTheDocument()
  })
})
