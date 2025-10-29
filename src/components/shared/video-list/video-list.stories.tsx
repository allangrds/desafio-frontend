import type { Meta, StoryObj } from '@storybook/react'
import { VideoList } from './video-list'

const meta: Meta<typeof VideoList> = {
  title: 'Components/VideoList',
  component: VideoList,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof VideoList>

export const Default: Story = {
  args: {
    videos: [
      {
        id: '1',
        title: 'Sample Video 1',
        thumbnailUrl: 'https://img.youtube.com/vi/dGcsHMXbSOA/hqdefault.jpg',
        channelName: 'Sample Channel',
        views: 1200,
        duration: '10:30',
        href: '#',
      },
      {
        id: '2',
        title: 'Sample Video 2',
        thumbnailUrl: 'https://img.youtube.com/vi/dGcsHMXbSOA/hqdefault.jpg',
        channelName: 'Another Channel',
        views: 850,
        duration: '5:45',
        href: '#',
      },
      {
        id: '3',
        title: 'Sample Video 3',
        thumbnailUrl: 'https://img.youtube.com/vi/dGcsHMXbSOA/hqdefault.jpg',
        channelName: 'Channel Three',
        views: 2300,
        duration: '15:20',
        href: '#',
      },
    ],
  },
}
