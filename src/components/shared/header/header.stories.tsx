import type { Meta, StoryObj } from '@storybook/react'

import { UserMenuSkeleton } from './user-menu/user-menu-skeleton'
import { UserMenu } from './user-menu/user-menu'

import { Header } from './header'

const meta = {
  title: 'Components/Header',
  component: Header,
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const WithSkeleton: Story = {
  args: {
    onSearch: (query) => console.log('Search:', query),
    onAddSearch: (query) => console.log('Add Search:', query),
    recentSearches: ['React', 'Next.js', 'TypeScript'],
    SignInRegisterButtons: <UserMenuSkeleton />,
  },
}

export const WithButtons: Story = {
  args: {
    onSearch: (query) => console.log('Search:', query),
    onAddSearch: (query) => console.log('Add Search:', query),
    recentSearches: ['React', 'Next.js', 'TypeScript'],
    SignInRegisterButtons: (
      <UserMenu
        onClickSignIn={() => console.log('Sign In clicked')}
        onClickRegister={() => console.log('Register clicked')}
        onLogout={() => console.log('Logout clicked')}
      />
    ),
  },
}

export const WithProfile: Story = {
  args: {
    onSearch: (query) => console.log('Search:', query),
    onAddSearch: (query) => console.log('Add Search:', query),
    recentSearches: ['React', 'Next.js', 'TypeScript'],
    SignInRegisterButtons: (
      <UserMenu
        onClickSignIn={() => console.log('Sign In clicked')}
        onClickRegister={() => console.log('Register clicked')}
        onLogout={() => console.log('Logout clicked')}
        tokens={{ accessToken: 'fake-access-token' }}
        user={{
          name: 'John Doe',
          picture: 'https://via.placeholder.com/150',
          email: 'john.doe@example.com',
          channelTitle: "John's Channel",
        }}
      />
    ),
  },
}
