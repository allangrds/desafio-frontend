import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { VideoList } from '@/components/shared/video-list'
import { VideoListSkeleton } from '@/components/shared/video-list/video-list-skeleton'
import { HomeView } from './home.view'

const mockVideos = [
  {
    id: '1',
    title: 'Getting Started with Next.js 16',
    thumbnailUrl: 'https://picsum.photos/seed/next16/320/180',
    channelName: 'Next.js Channel',
    views: 145000,
    duration: '12:34',
    href: 'https://www.youtube.com/watch?v=example1',
  },
  {
    id: '2',
    title: 'React 19 Deep Dive',
    thumbnailUrl: 'https://picsum.photos/seed/react19/320/180',
    channelName: 'React Team',
    views: 98000,
    duration: '25:00',
    href: 'https://www.youtube.com/watch?v=example2',
  },
]

const baseHeader = {
  onSearch: fn(),
  onAddSearch: fn(),
  initialQuery: '',
  recentSearches: [],
  SignInRegisterButtons: null,
}

const meta = {
  title: 'Features/Home',
  component: HomeView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HomeView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    header: baseHeader,
    featuredVideos: {
      Component: <VideoList videos={mockVideos} />,
    },
    otherVideos: {
      Component: <VideoList videos={mockVideos} />,
    },
  },
}

export const Loading: Story = {
  args: {
    header: baseHeader,
    featuredVideos: {
      Component: <VideoListSkeleton quantity={6} />,
    },
    otherVideos: {
      Component: <VideoListSkeleton quantity={6} />,
    },
  },
}

export const EmptySearchHistory: Story = {
  args: {
    header: { ...baseHeader, recentSearches: [] },
    featuredVideos: {
      Component: <VideoList videos={mockVideos} />,
    },
    otherVideos: {
      Component: <VideoList videos={mockVideos} />,
    },
  },
}

export const WithRecentSearches: Story = {
  args: {
    header: {
      ...baseHeader,
      recentSearches: ['Next.js', 'React hooks', 'TypeScript generics'],
    },
    featuredVideos: {
      Component: <VideoList videos={mockVideos} />,
    },
    otherVideos: {
      Component: <VideoList videos={mockVideos} />,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const searchInput = canvas.getByRole('searchbox')
    await userEvent.click(searchInput)
    const history = await canvas.findByRole('listbox')
    await expect(history).toBeInTheDocument()
  },
}

export const SearchError: Story = {
  args: {
    header: { ...baseHeader, initialQuery: 'failed query' },
    featuredVideos: {
      Component: (
        <p role="alert" className="text-destructive">
          Failed to load featured videos
        </p>
      ),
    },
    otherVideos: {
      Component: (
        <p role="alert" className="text-destructive">
          Failed to load other videos
        </p>
      ),
    },
  },
}
