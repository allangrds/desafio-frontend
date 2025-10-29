import { getVideos } from './youtube.service'
import type { Video } from '@/types/youtube'

// Mock googleapis
jest.mock('googleapis', () => {
  const mockList = jest.fn()
  return {
    google: {
      youtube: jest.fn(() => ({
        videos: {
          list: mockList,
        },
      })),
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
              url: 'https://example.com/thumb1.jpg',
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
              url: 'https://example.com/thumb2.jpg',
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
              url: 'https://example.com/thumb3.jpg',
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
  const mockList = google.youtube().videos.list

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
      mockList.mockRejectedValueOnce(new Error('API Error'))

      await expect(getVideos()).rejects.toThrow()
    })
  })
})
