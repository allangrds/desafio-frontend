import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('iron-session', () => ({
  getIronSession: jest.fn(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('@/constants/session', () => ({
  SESSION_OPTIONS: { password: 'test', cookieName: 'test' },
}))

jest.mock('./user-menu.container', () => ({
  UserMenu: ({ user }: { user?: { name: string } }) => (
    <div data-testid="user-menu-container">{user?.name ?? 'no-user'}</div>
  ),
}))

import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { UserMenu } from './user-menu'

describe('UserMenu (server component)', () => {
  const mockGetIronSession = getIronSession as jest.Mock
  const mockCookies = cookies as jest.Mock

  beforeEach(() => {
    const mockCookieStore = {}
    mockCookies.mockResolvedValue(mockCookieStore)
  })

  it('renders UserMenu container with user from session', async () => {
    mockGetIronSession.mockResolvedValue({
      user: { name: 'Alice', email: 'a@a.com', picture: '', channelTitle: '' },
    })

    const component = await UserMenu()
    render(component)

    expect(screen.getByTestId('user-menu-container')).toHaveTextContent('Alice')
  })

  it('renders UserMenu container with no user when session is empty', async () => {
    mockGetIronSession.mockResolvedValue({})

    const component = await UserMenu()
    render(component)

    expect(screen.getByTestId('user-menu-container')).toHaveTextContent(
      'no-user',
    )
  })
})
