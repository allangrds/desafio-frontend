import { render, screen } from '@testing-library/react'
import { OtherVideos } from './other-videos'

global.fetch = jest.fn()

const mockVideos = [
  {
    id: 'video1',
    title: 'Popular Video 1',
    thumbnailUrl: 'https://img.youtube.com/thumb1.jpg',
    channelName: 'Channel 1',
    views: 1000,
    duration: '10:30',
    href: 'https://www.youtube.com/watch?v=video1',
  },
  {
    id: 'video2',
    title: 'Popular Video 2',
    thumbnailUrl: 'https://img.youtube.com/thumb2.jpg',
    channelName: 'Channel 2',
    views: 2500,
    duration: '15:45',
    href: 'https://www.youtube.com/watch?v=video2',
  },
  {
    id: 'video3',
    title: 'Popular Video 3',
    thumbnailUrl: 'https://img.youtube.com/thumb3.jpg',
    channelName: 'Channel 3',
    views: 5000,
    duration: '20:15',
    href: 'https://www.youtube.com/watch?v=video3',
  },
]

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('OtherVideos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render popular videos from API', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockVideos,
    } as Response)

    render(await OtherVideos())

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/videos?maxResults=6',
    )
    expect(screen.getByText('Popular Video 1')).toBeDefined()
    expect(screen.getByText('Popular Video 2')).toBeDefined()
    expect(screen.getByText('Popular Video 3')).toBeDefined()
  })

  it('should render NoVideos component when no videos are returned', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response)

    render(await OtherVideos())

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(screen.getByText('No videos found')).toBeDefined()
  })

  it('should render NoVideos component when API call fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    render(await OtherVideos())

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(screen.getByText('No videos found')).toBeDefined()
    jest.restoreAllMocks()
  })

  it('should handle connection issues gracefully', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch.mockRejectedValue(new Error('Failed to fetch'))

    render(await OtherVideos())

    expect(screen.getByText('No videos found')).toBeDefined()
    jest.restoreAllMocks()
  })
})
