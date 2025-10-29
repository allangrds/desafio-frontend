import type { Meta, StoryObj } from '@storybook/react'

import { UserMenu } from './user-menu'

const meta = {
  title: 'Components/Header/UserMenu',
  component: UserMenu,
} satisfies Meta<typeof UserMenu>

export default meta
type Story = StoryObj<typeof meta>

export const WithButtons: Story = {
  args: {
    onClickSignIn: () => console.log('Sign In clicked'),
    onClickRegister: () => console.log('Register clicked'),
    onLogout: () => console.log('Logout clicked'),
  },
}

export const WithProfile: Story = {
  args: {
    onClickSignIn: () => console.log('Sign In clicked'),
    onClickRegister: () => console.log('Register clicked'),
    onLogout: () => console.log('Logout clicked'),
    tokens: { accessToken: 'fake-access-token' },
    user: {
      name: 'John Doe',
      picture: 'https://via.placeholder.com/150',
      email: 'john.doe@example.com',
      channelTitle: "John's Channel",
    },
  },
}
