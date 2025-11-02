import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { UserMenu } from './user-menu.container'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('../../../../components/shared/header/user-menu/user-menu', () => ({
  UserMenu: ({
    user,
    onClickSignIn,
    onClickRegister,
    onLogout,
  }: {
    user?: { name: string }
    onClickSignIn: () => void
    onClickRegister: () => void
    onLogout: () => void
  }) => (
    <div>
      {!user && (
        <>
          <button type="button" onClick={onClickSignIn}>
            Sign In
          </button>
          <button type="button" onClick={onClickRegister}>
            Register
          </button>
        </>
      )}
      {user && (
        <>
          <span>{user.name}</span>
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  ),
}))

describe('UserMenu container', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  it('should navigate to /auth/signin when Sign In is clicked', async () => {
    render(<UserMenu />)

    const signInButton = screen.getByRole('button', { name: /sign in/i })
    await userEvent.click(signInButton)

    expect(mockPush).toHaveBeenCalledWith('/auth/signin')
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  it('should navigate to /auth/register when Register is clicked', async () => {
    render(<UserMenu />)

    const registerButton = screen.getByRole('button', { name: /register/i })
    await userEvent.click(registerButton)

    expect(mockPush).toHaveBeenCalledWith('/auth/register')
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  it('should navigate to /auth/logout when Logout is clicked', async () => {
    const user = {
      name: 'John Doe',
      picture: 'https://example.com/picture.jpg',
      email: 'john@example.com',
      channelTitle: "John's Channel",
    }

    render(<UserMenu user={user} />)

    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await userEvent.click(logoutButton)

    expect(mockPush).toHaveBeenCalledWith('/auth/logout')
    expect(mockPush).toHaveBeenCalledTimes(1)
  })

  it('should pass user data to UserMenu component', () => {
    const user = {
      name: 'Jane Doe',
      picture: 'https://example.com/jane.jpg',
      email: 'jane@example.com',
      channelTitle: "Jane's Channel",
    }

    render(<UserMenu user={user} />)

    expect(screen.getByText('Jane Doe')).toBeDefined()
  })
})
