import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, within } from 'storybook/test'
import { NoVideos } from '@/components/shared/no-videos'
import { VideoList } from '@/components/shared/video-list'
import { VideoListSkeleton } from '@/components/shared/video-list/video-list-skeleton'
import { ResultsView } from './results.view'

const mockVideos = [
  {
    id: '1',
    title: 'React Hooks Deep Dive',
    thumbnailUrl: 'https://picsum.photos/seed/hooks/320/180',
    channelName: 'React Academy',
    views: 75000,
    duration: '18:45',
    href: 'https://www.youtube.com/watch?v=example1',
  },
  {
    id: '2',
    title: 'TypeScript Advanced Patterns',
    thumbnailUrl: 'https://picsum.photos/seed/ts/320/180',
    channelName: 'TypeScript Pro',
    views: 42000,
    duration: '32:10',
    href: 'https://www.youtube.com/watch?v=example2',
  },
  {
    id: '3',
    title: 'Next.js App Router Guide',
    thumbnailUrl: 'https://picsum.photos/seed/approuter/320/180',
    channelName: 'Vercel',
    views: 210000,
    duration: '45:00',
    href: 'https://www.youtube.com/watch?v=example3',
  },
]

const baseHeader = {
  onSearch: fn(),
  onAddSearch: fn(),
  initialQuery: 'react hooks',
  recentSearches: ['react', 'typescript'],
  SignInRegisterButtons: null,
}

const meta = {
  title: 'Features/Results',
  component: ResultsView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ResultsView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    header: baseHeader,
    searchResults: {
      Component: <VideoList videos={mockVideos} />,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', {
      name: /search results for "react hooks"/i,
    })
    await expect(heading).toBeInTheDocument()
  },
}

export const Loading: Story = {
  args: {
    header: baseHeader,
    searchResults: {
      Component: <VideoListSkeleton quantity={6} />,
    },
  },
}

export const Empty: Story = {
  args: {
    header: { ...baseHeader, initialQuery: 'xyznotfound' },
    searchResults: {
      Component: <NoVideos />,
    },
  },
}

export const SearchError: Story = {
  args: {
    header: { ...baseHeader, initialQuery: 'search failed' },
    searchResults: {
      Component: <NoVideos />,
    },
  },
}
