import { render, screen } from '@testing-library/react'
import { FeaturedVideos } from './featured-videos'
import { getVideos } from '../../../services/youtube/youtube.service'

jest.mock('../../../services/youtube/youtube.service', () => ({
  getVideos: jest.fn(),
}))

const mockVideos = [
  {
    id: 'video1',
    title: 'Featured Video 1',
    thumbnailUrl: 'https://img.youtube.com/thumb1.jpg',
    channelName: 'Channel 1',
    views: 1000,
    duration: '10:30',
    href: 'https://www.youtube.com/watch?v=video1',
  },
  {
    id: 'video2',
    title: 'Featured Video 2',
    thumbnailUrl: 'https://img.youtube.com/thumb2.jpg',
    channelName: 'Channel 2',
    views: 2500,
    duration: '15:45',
    href: 'https://www.youtube.com/watch?v=video2',
  },
  {
    id: 'video3',
    title: 'Featured Video 3',
    thumbnailUrl: 'https://img.youtube.com/thumb3.jpg',
    channelName: 'Channel 3',
    views: 5000,
    duration: '20:15',
    href: 'https://www.youtube.com/watch?v=video3',
  },
]

const mockGetVideos = getVideos as jest.MockedFunction<typeof getVideos>

describe('FeaturedVideos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render featured videos from YouTube service', async () => {
    mockGetVideos.mockResolvedValue(mockVideos)

    render(await FeaturedVideos())

    expect(getVideos).toHaveBeenCalledTimes(1)
    expect(getVideos).toHaveBeenCalledWith({ videoCategoryId: '28' })
    expect(screen.getByText('Featured Video 1')).toBeDefined()
    expect(screen.getByText('Featured Video 2')).toBeDefined()
    expect(screen.getByText('Featured Video 3')).toBeDefined()
  })

  it('should render NoVideos component when no videos are returned', async () => {
    mockGetVideos.mockResolvedValue([])

    render(await FeaturedVideos())

    expect(getVideos).toHaveBeenCalledTimes(1)
    expect(screen.getByText('No videos found')).toBeDefined()
  })

  it('should render NoVideos component when API call fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    mockGetVideos.mockRejectedValue(new Error('Network error'))

    render(await FeaturedVideos())

    expect(getVideos).toHaveBeenCalledTimes(1)
    expect(screen.getByText('No videos found')).toBeDefined()
    jest.restoreAllMocks()
  })

  it('should handle API timeout gracefully', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    mockGetVideos.mockRejectedValue(new Error('Request timeout'))

    render(await FeaturedVideos())

    expect(screen.getByText('No videos found')).toBeDefined()
    jest.restoreAllMocks()
  })
})
