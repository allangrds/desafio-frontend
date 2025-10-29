import type { Meta, StoryObj } from '@storybook/react'

import { UserMenuSkeleton } from './user-menu-skeleton'

const meta = {
  title: 'Components/Header/UserMenuSkeleton',
  component: UserMenuSkeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof UserMenuSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
