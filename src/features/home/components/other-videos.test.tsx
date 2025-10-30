import { render, screen } from '@testing-library/react'
import { OtherVideos } from './other-videos'
import { getVideos } from '../../../services/youtube/youtube.service'

jest.mock('../../../services/youtube/youtube.service', () => ({
  getVideos: jest.fn(),
}))

const mockVideos = [
  {
    id: 'video1',
    title: 'Popular Video 1',
    thumbnailUrl: 'https://example.com/thumb1.jpg',
    channelName: 'Channel 1',
    views: 1000,
    duration: '10:30',
    href: 'https://www.youtube.com/watch?v=video1',
  },
  {
    id: 'video2',
    title: 'Popular Video 2',
    thumbnailUrl: 'https://example.com/thumb2.jpg',
    channelName: 'Channel 2',
    views: 2500,
    duration: '15:45',
    href: 'https://www.youtube.com/watch?v=video2',
  },
  {
    id: 'video3',
    title: 'Popular Video 3',
    thumbnailUrl: 'https://example.com/thumb3.jpg',
    channelName: 'Channel 3',
    views: 5000,
    duration: '20:15',
    href: 'https://www.youtube.com/watch?v=video3',
  },
]

const mockGetVideos = getVideos as jest.MockedFunction<typeof getVideos>

describe('OtherVideos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render popular videos from YouTube service', async () => {
    mockGetVideos.mockResolvedValue(mockVideos)

    render(await OtherVideos())

    expect(getVideos).toHaveBeenCalledTimes(1)
    expect(getVideos).toHaveBeenCalledWith({ maxResults: 6 })
    expect(screen.getByText('Popular Video 1')).toBeDefined()
    expect(screen.getByText('Popular Video 2')).toBeDefined()
    expect(screen.getByText('Popular Video 3')).toBeDefined()
  })

  it('should render NoVideos component when no videos are returned', async () => {
    mockGetVideos.mockResolvedValue([])

    render(await OtherVideos())

    expect(getVideos).toHaveBeenCalledTimes(1)
    expect(screen.getByText('No videos found')).toBeDefined()
  })

  it('should render NoVideos component when API call fails', async () => {
    mockGetVideos.mockRejectedValue(new Error('Network error'))

    render(await OtherVideos())

    expect(getVideos).toHaveBeenCalledTimes(1)
    expect(screen.getByText('No videos found')).toBeDefined()
  })

  it('should handle connection issues gracefully', async () => {
    mockGetVideos.mockRejectedValue(new Error('Failed to fetch'))

    render(await OtherVideos())

    expect(screen.getByText('No videos found')).toBeDefined()
  })
})
