import type { Meta, StoryObj } from '@storybook/react'

import { VideoListSkeleton } from './video-list-skeleton'

const meta = {
  title: 'Components/VideoList/VideoListSkeleton',
  component: VideoListSkeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof VideoListSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    quantity: 3,
  },
}
