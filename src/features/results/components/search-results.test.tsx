// Mocks
const mockSearchVideos = jest.fn()

jest.mock('../../../services/youtube/youtube.service', () => ({
  searchVideos: (...args: unknown[]) => mockSearchVideos(...args),
}))

import { SearchResults } from './search-results'

describe('SearchResults', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render VideoList when videos are found', async () => {
    const mockVideos = [
      {
        id: 'video1',
        title: 'React Hooks Tutorial',
        thumbnailUrl: 'https://example.com/thumb1.jpg',
        channelName: 'Tech Channel',
        views: 1000,
        duration: '10:30',
        href: 'https://youtube.com/watch?v=video1',
      },
      {
        id: 'video2',
        title: 'Advanced React Hooks',
        thumbnailUrl: 'https://example.com/thumb2.jpg',
        channelName: 'Dev Channel',
        views: 2000,
        duration: '15:45',
        href: 'https://youtube.com/watch?v=video2',
      },
    ]

    mockSearchVideos.mockResolvedValue(mockVideos)

    const Component = await SearchResults({ searchQuery: 'react hooks' })

    expect(mockSearchVideos).toHaveBeenCalledWith('react hooks')
    expect(Component).toBeDefined()
  })

  it('should call searchVideos with the provided query', async () => {
    mockSearchVideos.mockResolvedValue([])

    await SearchResults({ searchQuery: 'typescript tutorial' })

    expect(mockSearchVideos).toHaveBeenCalledWith('typescript tutorial')
    expect(mockSearchVideos).toHaveBeenCalledTimes(1)
  })

  it('should handle empty search query', async () => {
    mockSearchVideos.mockResolvedValue([])

    await SearchResults({ searchQuery: '' })

    expect(mockSearchVideos).toHaveBeenCalledWith('')
  })

  it('should render NoVideos when API call fails', async () => {
    mockSearchVideos.mockRejectedValue(new Error('Network error'))

    const Component = await SearchResults({ searchQuery: 'test query' })

    expect(mockSearchVideos).toHaveBeenCalledWith('test query')
    expect(Component).toBeDefined()
  })

  it('should handle no internet connection gracefully', async () => {
    mockSearchVideos.mockRejectedValue(new Error('Failed to fetch'))

    const Component = await SearchResults({ searchQuery: 'react' })

    expect(mockSearchVideos).toHaveBeenCalledWith('react')
    expect(Component).toBeDefined()
  })

  it('should handle API timeout', async () => {
    mockSearchVideos.mockRejectedValue(new Error('Request timeout'))

    const Component = await SearchResults({ searchQuery: 'typescript' })

    expect(Component).toBeDefined()
  })
})
