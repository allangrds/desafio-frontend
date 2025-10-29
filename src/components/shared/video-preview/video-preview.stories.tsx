import type { Meta, StoryObj } from '@storybook/react'

import { VideoPreview } from './video-preview'

const meta = {
  title: 'Components/VideoPreview',
  component: VideoPreview,
  tags: ['autodocs'],
} satisfies Meta<typeof VideoPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Sample Video Title',
    thumbnailUrl: 'https://via.placeholder.com/320x180.png?text=Thumbnail',
    href: '/video/sample-video',
    channelName: 'Sample Channel',
    views: 123456,
    duration: '12:34',
  },
}
