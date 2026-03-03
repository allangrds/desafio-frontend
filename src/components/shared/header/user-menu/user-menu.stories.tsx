import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { UserMenu } from './user-menu'

const meta = {
  title: 'Components/Header/UserMenu',
  component: UserMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof UserMenu>

export default meta
type Story = StoryObj<typeof meta>

export const WithButtons: Story = {
  args: {
    onClickSignIn: fn(),
    onClickRegister: fn(),
    onLogout: fn(),
  },
}

export const WithProfile: Story = {
  args: {
    onClickSignIn: fn(),
    onClickRegister: fn(),
    onLogout: fn(),
    user: {
      name: 'John Doe',
      picture: 'https://lh3.googleusercontent.com/a/placeholder',
      email: 'john.doe@example.com',
      channelTitle: "John's Channel",
    },
  },
}

export const OpensDropdown: Story = {
  args: {
    onClickSignIn: fn(),
    onClickRegister: fn(),
    onLogout: fn(),
    user: {
      name: 'Jane Smith',
      picture: 'https://lh3.googleusercontent.com/a/placeholder',
      email: 'jane.smith@example.com',
      channelTitle: "Jane's Channel",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const avatarButton = canvas.getByRole('button')
    await userEvent.click(avatarButton)
    const dropdown = await within(document.body).findByRole('menu')
    await expect(dropdown).toBeInTheDocument()
  },
}
