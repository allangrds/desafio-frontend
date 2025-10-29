import type { Meta, StoryObj } from '@storybook/react'

import { VideoPreviewSkeleton } from './video-preview-skeleton'

const meta = {
  title: 'Components/VideoPreview/VideoPreviewSkeleton',
  component: VideoPreviewSkeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof VideoPreviewSkeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
