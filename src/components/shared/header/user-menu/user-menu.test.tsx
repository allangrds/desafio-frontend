import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { UserMenu } from './user-menu'

describe('UserMenu', () => {
  it('should render Sign In and Register buttons when no tokens or user', () => {
    const mockOnClickSignIn = jest.fn()
    const mockOnClickRegister = jest.fn()
    const mockOnLogout = jest.fn()

    render(
      <UserMenu
        onClickSignIn={mockOnClickSignIn}
        onClickRegister={mockOnClickRegister}
        onLogout={mockOnLogout}
      />,
    )

    const signInButton = screen.getByRole('button', { name: /sign in/i })
    const registerButton = screen.getByRole('button', {
      name: /create account/i,
    })

    expect(signInButton).toBeDefined()
    expect(registerButton).toBeDefined()
  })

  it('should render user avatar and dropdown menu when tokens and user are provided', async () => {
    const mockOnClickSignIn = jest.fn()
    const mockOnClickRegister = jest.fn()
    const mockOnLogout = jest.fn()

    const user = {
      name: 'Jane Doe',
      picture: 'https://via.placeholder.com/150',
      email: 'jane.doe@example.com',
      channelTitle: "Jane's Channel",
    }

    const tokens = {
      accessToken: 'fake-access-token',
    }

    render(
      <UserMenu
        onClickSignIn={mockOnClickSignIn}
        onClickRegister={mockOnClickRegister}
        onLogout={mockOnLogout}
        tokens={tokens}
        user={user}
      />,
    )

    const avatarButton = screen.getByRole('button')
    expect(avatarButton).toBeDefined()
    await userEvent.click(avatarButton)

    const logoutItem = await screen.getByText(/log out/i)
    expect(logoutItem).toBeDefined()
    await userEvent.click(logoutItem)

    expect(mockOnLogout).toHaveBeenCalled()
    expect(mockOnLogout).toHaveBeenCalledTimes(1)
  })

  it('should call onClickSignIn when Sign In button is clicked', async () => {
    const mockOnClickSignIn = jest.fn()
    const mockOnClickRegister = jest.fn()
    const mockOnLogout = jest.fn()

    render(
      <UserMenu
        onClickSignIn={mockOnClickSignIn}
        onClickRegister={mockOnClickRegister}
        onLogout={mockOnLogout}
      />,
    )

    const signInButton = screen.getByRole('button', { name: /sign in/i })
    await userEvent.click(signInButton)

    expect(mockOnClickSignIn).toHaveBeenCalled()
    expect(mockOnClickSignIn).toHaveBeenCalledTimes(1)
    expect(mockOnClickRegister).not.toHaveBeenCalled()
  })

  it('should call onClickRegister when Create Account button is clicked', async () => {
    const mockOnClickSignIn = jest.fn()
    const mockOnClickRegister = jest.fn()
    const mockOnLogout = jest.fn()

    render(
      <UserMenu
        onClickSignIn={mockOnClickSignIn}
        onClickRegister={mockOnClickRegister}
        onLogout={mockOnLogout}
      />,
    )

    const createAccountButton = screen.getByRole('button', {
      name: /create account/i,
    })
    await userEvent.click(createAccountButton)

    expect(mockOnClickRegister).toHaveBeenCalled()
    expect(mockOnClickRegister).toHaveBeenCalledTimes(1)
    expect(mockOnClickSignIn).not.toHaveBeenCalled()
  })
})
