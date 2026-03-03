import { getVideos, searchVideos, uploadVideo } from './youtube.service'

// Mock googleapis — all mock fns are defined inside factory to avoid hoisting issues
jest.mock('googleapis', () => {
  const mockList = jest.fn()
  const mockSearch = jest.fn()
  const mockInsert = jest.fn()
  const mockSetCredentials = jest.fn()
  const mockOAuth2Instance = { setCredentials: mockSetCredentials }
  return {
    google: {
      youtube: jest.fn(() => ({
        videos: { list: mockList, insert: mockInsert },
        search: { list: mockSearch },
      })),
      auth: {
        OAuth2: jest.fn().mockReturnValue(mockOAuth2Instance),
      },
    },
  }
})

const mockYouTubeResponse = {
  data: {
    items: [
      {
        id: 'video1',
        snippet: {
          title: 'Test Video 1',
          channelTitle: 'Test Channel 1',
          thumbnails: {
            high: {
              url: 'https://img.youtube.com/thumb1.jpg',
              width: 480,
              height: 360,
            },
          },
        },
        statistics: {
          viewCount: '1000',
          likeCount: '100',
          commentCount: '10',
        },
        contentDetails: {
          duration: 'PT10M30S',
        },
      },
      {
        id: 'video2',
        snippet: {
          title: 'Test Video 2',
          channelTitle: 'Test Channel 2',
          thumbnails: {
            medium: {
              url: 'https://img.youtube.com/thumb2.jpg',
              width: 320,
              height: 180,
            },
          },
        },
        statistics: {
          viewCount: '2500',
          likeCount: '200',
          commentCount: '20',
        },
        contentDetails: {
          duration: 'PT15M45S',
        },
      },
      {
        id: 'video3',
        snippet: {
          title: 'Test Video 3',
          channelTitle: 'Test Channel 3',
          thumbnails: {
            high: {
              url: 'https://img.youtube.com/thumb3.jpg',
              width: 480,
              height: 360,
            },
          },
        },
        statistics: {
          viewCount: '5000',
          likeCount: '500',
          commentCount: '50',
        },
        contentDetails: {
          duration: 'PT1H20M15S',
        },
      },
    ],
  },
}

describe('YouTubeService', () => {
  const { google } = require('googleapis')
  const mockYouTubeInstance = google.youtube()
  const mockList = mockYouTubeInstance.videos.list
  const mockSearch = mockYouTubeInstance.search.list
  const mockInsert = mockYouTubeInstance.videos.insert
  const mockOAuth2Instance = new google.auth.OAuth2()
  const mockSetCredentials = mockOAuth2Instance.setCredentials

  beforeEach(() => {
    jest.clearAllMocks()
    mockList.mockResolvedValue(mockYouTubeResponse)
  })

  describe('getVideos', () => {
    it('should return exactly 3 videos with default params', async () => {
      const videos = await getVideos()

      expect(Array.isArray(videos)).toBe(true)
      expect(videos).toHaveLength(3)

      const firstVideo = videos[0]
      expect(firstVideo).toHaveProperty('id')
      expect(firstVideo).toHaveProperty('title')
      expect(firstVideo).toHaveProperty('thumbnailUrl')
      expect(firstVideo).toHaveProperty('channelName')
      expect(firstVideo).toHaveProperty('views')
      expect(firstVideo).toHaveProperty('duration')
      expect(firstVideo).toHaveProperty('href')
    })

    it('should return videos with custom maxResults', async () => {
      await getVideos({ maxResults: 5 })

      expect(mockList).toHaveBeenCalledWith(
        expect.objectContaining({
          maxResults: 5,
        }),
      )
    })

    it('should return videos with custom category', async () => {
      await getVideos({ videoCategoryId: '28' })

      expect(mockList).toHaveBeenCalledWith(
        expect.objectContaining({
          videoCategoryId: '28',
        }),
      )
    })

    it('should return videos with custom region', async () => {
      await getVideos({ regionCode: 'BR' })

      expect(mockList).toHaveBeenCalledWith(
        expect.objectContaining({
          regionCode: 'BR',
        }),
      )
    })
  })

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      mockList.mockRejectedValue(new Error('API Error'))

      await expect(getVideos()).rejects.toThrow()
    })
  })

  describe('searchVideos', () => {
    const mockSearchResponse = {
      data: {
        items: [
          {
            id: { videoId: 'search1' },
            snippet: {
              title: 'Search Result 1',
              channelTitle: 'Channel 1',
              thumbnails: {
                high: {
                  url: 'https://img.youtube.com/search1.jpg',
                  width: 480,
                  height: 360,
                },
              },
            },
          },
          {
            id: { videoId: 'search2' },
            snippet: {
              title: 'Search Result 2',
              channelTitle: 'Channel 2',
              thumbnails: {
                medium: {
                  url: 'https://img.youtube.com/search2.jpg',
                  width: 320,
                  height: 180,
                },
              },
            },
          },
        ],
      },
    }

    const mockVideoDetailsResponse = {
      data: {
        items: [
          {
            id: 'search1',
            snippet: {
              title: 'Search Result 1',
              channelTitle: 'Channel 1',
              thumbnails: {
                high: {
                  url: 'https://img.youtube.com/search1.jpg',
                  width: 480,
                  height: 360,
                },
              },
            },
            statistics: {
              viewCount: '1500',
              likeCount: '150',
              commentCount: '15',
            },
            contentDetails: {
              duration: 'PT8M20S',
            },
          },
          {
            id: 'search2',
            snippet: {
              title: 'Search Result 2',
              channelTitle: 'Channel 2',
              thumbnails: {
                medium: {
                  url: 'https://img.youtube.com/search2.jpg',
                  width: 320,
                  height: 180,
                },
              },
            },
            statistics: {
              viewCount: '3000',
              likeCount: '300',
              commentCount: '30',
            },
            contentDetails: {
              duration: 'PT12M45S',
            },
          },
        ],
      },
    }

    beforeEach(() => {
      mockSearch.mockResolvedValue(mockSearchResponse)
      mockList.mockResolvedValue(mockVideoDetailsResponse)
    })

    it('should search videos by query', async () => {
      const videos = await searchVideos('react hooks')

      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          q: 'react hooks',
          type: ['video'],
        }),
      )

      expect(videos).toHaveLength(2)
      expect(videos[0]).toHaveProperty('id', 'search1')
      expect(videos[0]).toHaveProperty('title', 'Search Result 1')
    })

    it('should return empty array when no results found', async () => {
      mockSearch.mockResolvedValue({ data: { items: [] } })

      const videos = await searchVideos('nonexistent query')

      expect(videos).toEqual([])
    })

    it('should use custom maxResults', async () => {
      await searchVideos('test', { maxResults: 10 })

      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          maxResults: 10,
        }),
      )
    })

    it('should use custom regionCode', async () => {
      await searchVideos('test', { regionCode: 'BR' })

      expect(mockSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          regionCode: 'BR',
        }),
      )
    })

    it('should fetch video details after search', async () => {
      await searchVideos('react hooks')

      expect(mockList).toHaveBeenCalledWith(
        expect.objectContaining({
          id: ['search1', 'search2'],
          part: ['snippet', 'statistics', 'contentDetails'],
        }),
      )
    })

    it('should handle search API errors', async () => {
      mockSearch.mockRejectedValue(new Error('Search API Error'))

      await expect(searchVideos('test')).rejects.toThrow()
    })
  })

  describe('uploadVideo', () => {
    const mockArrayBuffer = new ArrayBuffer(7)
    const mockFile = Object.assign(
      new File(['content'], 'video.mp4', {
        type: 'video/mp4',
      }),
      {
        arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer),
      },
    )

    beforeEach(() => {
      mockInsert.mockResolvedValue({
        data: {
          id: 'uploaded123',
          snippet: { title: 'My Video', description: 'A description' },
          status: { privacyStatus: 'public' },
        },
      })
    })

    it('should upload a video and return UploadedVideo', async () => {
      const result = await uploadVideo(
        'access-token',
        mockFile,
        'My Video',
        'A description',
        'public',
      )

      expect(result).toEqual({
        id: 'uploaded123',
        title: 'My Video',
        description: 'A description',
        privacy: 'public',
        url: 'https://www.youtube.com/watch?v=uploaded123',
      })
    })

    it('should set OAuth credentials with the access token', async () => {
      await uploadVideo('my-access-token', mockFile, 'Title', 'Desc', 'private')

      expect(mockSetCredentials).toHaveBeenCalledWith({
        access_token: 'my-access-token',
      })
    })

    it('falls back to provided title when response has no snippet title', async () => {
      mockInsert.mockResolvedValue({
        data: {
          id: 'vid456',
          snippet: {},
          status: {},
        },
      })

      const result = await uploadVideo(
        'token',
        mockFile,
        'Fallback Title',
        'Fallback Desc',
        'unlisted',
      )

      expect(result.title).toBe('Fallback Title')
      expect(result.description).toBe('Fallback Desc')
      expect(result.privacy).toBe('unlisted')
    })

    it('falls back to empty string when response has no id', async () => {
      mockInsert.mockResolvedValue({
        data: {
          snippet: { title: 'T', description: 'D' },
          status: { privacyStatus: 'public' },
        },
      })

      const result = await uploadVideo('token', mockFile, 'T', 'D', 'public')

      expect(result.id).toBe('')
      expect(result.url).toBe('https://www.youtube.com/watch?v=')
    })
  })

  describe('transformYouTubeVideo branches', () => {
    it('uses medium thumbnail when high is not available', async () => {
      mockList.mockResolvedValue({
        data: {
          items: [
            {
              id: 'vid-medium',
              snippet: {
                title: 'Medium Thumb Video',
                channelTitle: 'Channel',
                thumbnails: {
                  medium: { url: 'https://img.youtube.com/medium.jpg' },
                },
              },
              statistics: { viewCount: '100' },
              contentDetails: { duration: 'PT5M' },
            },
          ],
        },
      })

      const videos = await getVideos()
      expect(videos[0].thumbnailUrl).toBe('https://img.youtube.com/medium.jpg')
    })

    it('returns empty string when no thumbnail available', async () => {
      mockList.mockResolvedValue({
        data: {
          items: [
            {
              id: 'vid-nothumb',
              snippet: {
                title: 'No Thumb Video',
                channelTitle: 'Channel',
                thumbnails: {},
              },
              statistics: { viewCount: '0' },
              contentDetails: { duration: 'PT0S' },
            },
          ],
        },
      })

      const videos = await getVideos()
      expect(videos[0].thumbnailUrl).toBe('')
    })

    it('returns 0 views when statistics are missing', async () => {
      mockList.mockResolvedValue({
        data: {
          items: [
            {
              id: 'vid-nostats',
              snippet: {
                title: 'No Stats Video',
                channelTitle: 'Channel',
                thumbnails: { high: { url: 'https://img.youtube.com/h.jpg' } },
              },
              contentDetails: { duration: 'PT10M' },
            },
          ],
        },
      })

      const videos = await getVideos()
      expect(videos[0].views).toBe(0)
    })

    it('returns 0:00 duration when contentDetails are missing', async () => {
      mockList.mockResolvedValue({
        data: {
          items: [
            {
              id: 'vid-noduration',
              snippet: {
                title: 'No Duration Video',
                channelTitle: 'Channel',
                thumbnails: { high: { url: 'https://img.youtube.com/h.jpg' } },
              },
              statistics: { viewCount: '50' },
            },
          ],
        },
      })

      const videos = await getVideos()
      expect(videos[0].duration).toBe('0:00')
    })

    it('formats duration with hours correctly', async () => {
      mockList.mockResolvedValue({
        data: {
          items: [
            {
              id: 'vid-hours',
              snippet: {
                title: 'Long Video',
                channelTitle: 'Channel',
                thumbnails: { high: { url: 'https://img.youtube.com/h.jpg' } },
              },
              statistics: { viewCount: '999' },
              contentDetails: { duration: 'PT2H15M30S' },
            },
          ],
        },
      })

      const videos = await getVideos()
      expect(videos[0].duration).toBe('2:15:30')
    })

    it('returns 0:00 for invalid duration format', async () => {
      mockList.mockResolvedValue({
        data: {
          items: [
            {
              id: 'vid-invalid',
              snippet: {
                title: 'Invalid Duration',
                channelTitle: 'Channel',
                thumbnails: { high: { url: 'https://img.youtube.com/h.jpg' } },
              },
              statistics: { viewCount: '10' },
              contentDetails: { duration: 'INVALID' },
            },
          ],
        },
      })

      const videos = await getVideos()
      expect(videos[0].duration).toBe('0:00')
    })
  })
})
