import type { Meta, StoryObj } from '@storybook/react'
import { NoVideos } from './no-videos'

const meta: Meta<typeof NoVideos> = {
  title: 'Components/NoVideos',
  component: NoVideos,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof NoVideos>

export const Default: Story = {}
