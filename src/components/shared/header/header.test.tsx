import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { Header } from './header'

import { UserMenu } from './user-menu'

describe('Header', () => {
  it('should render the header with sign in/create account buttons', async () => {
    const mockOnSearch = jest.fn()
    const mockOnAddSearch = jest.fn()
    const initialQuery = ''
    const recentSearches = undefined

    const onClickSignIn = jest.fn()
    const onClickRegister = jest.fn()
    const onLogout = jest.fn()
    const tokens = undefined
    const user = undefined
    const SignInRegisterButtons = (
      <UserMenu
        onClickSignIn={onClickSignIn}
        onClickRegister={onClickRegister}
        onLogout={onLogout}
        tokens={tokens}
        user={user}
      />
    )

    render(
      <Header
        onSearch={mockOnSearch}
        onAddSearch={mockOnAddSearch}
        initialQuery={initialQuery}
        recentSearches={recentSearches}
        SignInRegisterButtons={SignInRegisterButtons}
      />,
    )

    const signInButton = await screen.getAllByRole('button', {
      name: /sign in/i,
    })
    const registerButton = await screen.getAllByRole('button', {
      name: /create account/i,
    })
    expect(signInButton).toHaveLength(2)
    expect(registerButton).toHaveLength(2)

    const avatarButton = await screen.queryAllByRole('button', {
      name: /JD/i,
    })
    expect(avatarButton).toHaveLength(0)
  })
  it('should render the header with profile buttons and show menu on click', async () => {
    const mockOnSearch = jest.fn()
    const mockOnAddSearch = jest.fn()
    const initialQuery = ''
    const recentSearches = undefined

    const onClickSignIn = jest.fn()
    const onClickRegister = jest.fn()
    const onLogout = jest.fn()
    const tokens = {
      accessToken: 'mockAccess',
    }
    const user = {
      name: 'John Doe',
      picture: 'https://via.placeholder.com/150',
      email: 'john.doe@example.com',
      channelTitle: "John's Channel",
    }
    const SignInRegisterButtons = (
      <UserMenu
        onClickSignIn={onClickSignIn}
        onClickRegister={onClickRegister}
        onLogout={onLogout}
        tokens={tokens}
        user={user}
      />
    )

    render(
      <Header
        onSearch={mockOnSearch}
        onAddSearch={mockOnAddSearch}
        initialQuery={initialQuery}
        recentSearches={recentSearches}
        SignInRegisterButtons={SignInRegisterButtons}
      />,
    )

    const signInButton = await screen.queryAllByRole('button', {
      name: /sign in/i,
    })
    const registerButton = await screen.queryAllByRole('button', {
      name: /create account/i,
    })
    expect(signInButton).toHaveLength(0)
    expect(registerButton).toHaveLength(0)

    const avatarButtons = await screen.getAllByRole('button', {
      name: /JD/i,
    })
    expect(avatarButtons).toHaveLength(2)

    await userEvent.click(avatarButtons[0])
    expect(await screen.findByText(user.name)).toBeInTheDocument()
    expect(await screen.findByText(user.email)).toBeInTheDocument()
    expect(await screen.findByText(user.channelTitle)).toBeInTheDocument()
    expect(await screen.findByText(/log out/i)).toBeInTheDocument()
    expect(await screen.findByText(/upload video/i)).toBeInTheDocument()
  })
})
