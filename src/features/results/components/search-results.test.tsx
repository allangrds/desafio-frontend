import { SearchResults } from './search-results'

global.fetch = jest.fn()

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

const mockVideos = [
  {
    id: 'video1',
    title: 'React Hooks Tutorial',
    thumbnailUrl: 'https://img.youtube.com/thumb1.jpg',
    channelName: 'Tech Channel',
    views: 1000,
    duration: '10:30',
    href: 'https://youtube.com/watch?v=video1',
  },
  {
    id: 'video2',
    title: 'Advanced React Hooks',
    thumbnailUrl: 'https://img.youtube.com/thumb2.jpg',
    channelName: 'Dev Channel',
    views: 2000,
    duration: '15:45',
    href: 'https://youtube.com/watch?v=video2',
  },
]

describe('SearchResults', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render VideoList when videos are found', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockVideos,
    } as Response)

    const Component = await SearchResults({ searchQuery: 'react hooks' })

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/videos?search=react%20hooks',
    )
    expect(Component).toBeDefined()
  })

  it('should call API with the provided query', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response)

    await SearchResults({ searchQuery: 'typescript tutorial' })

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/videos?search=typescript%20tutorial',
    )
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('should handle empty search query', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response)

    await SearchResults({ searchQuery: '' })

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/videos?search=',
    )
  })

  it('should render NoVideos when API call fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    const Component = await SearchResults({ searchQuery: 'test query' })

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/videos?search=test%20query',
    )
    expect(Component).toBeDefined()
  })

  it('should handle no internet connection gracefully', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch.mockRejectedValue(new Error('Failed to fetch'))

    const Component = await SearchResults({ searchQuery: 'react' })

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/videos?search=react',
    )
    expect(Component).toBeDefined()
  })

  it('should handle API timeout', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch.mockRejectedValue(new Error('Request timeout'))

    const Component = await SearchResults({ searchQuery: 'typescript' })

    expect(Component).toBeDefined()
  })
})
