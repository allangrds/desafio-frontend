/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

jest.mock('@/lib/session', () => ({
  getSession: jest.fn(),
  saveSession: jest.fn(),
  destroySession: jest.fn(),
}))

jest.mock('@/services/youtube/youtube.service', () => ({
  uploadVideo: jest.fn(),
  getVideos: jest.fn(),
  searchVideos: jest.fn(),
}))

import { getSession } from '@/lib/session'
import {
  getVideos,
  searchVideos,
  uploadVideo,
} from '@/services/youtube/youtube.service'
import { mockSession } from '@/test-utils/session'
import type { SessionData } from '@/types/auth'
import { GET, POST } from './route'

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>
const mockUploadVideo = uploadVideo as jest.MockedFunction<typeof uploadVideo>
const mockGetVideos = getVideos as jest.MockedFunction<typeof getVideos>
const mockSearchVideos = searchVideos as jest.MockedFunction<
  typeof searchVideos
>

const createGetRequest = (url: string): NextRequest =>
  new NextRequest(url, { method: 'GET' })

const createPostRequest = (formData: FormData): NextRequest => {
  return new NextRequest('http://localhost:3000/api/videos', {
    method: 'POST',
    body: formData,
  })
}

const mockVideos = [
  {
    id: 'v1',
    title: 'Video 1',
    thumbnailUrl: 'https://img.youtube.com/t1.jpg',
    channelName: 'Channel 1',
    views: 100,
    duration: '5:00',
    href: 'https://youtube.com/watch?v=v1',
  },
]

describe('GET /api/videos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('returns videos with no search params (default)', async () => {
    mockGetVideos.mockResolvedValue(mockVideos)

    const req = createGetRequest('http://localhost:3000/api/videos')
    const res = await GET(req)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual(mockVideos)
    expect(mockGetVideos).toHaveBeenCalledWith({ maxResults: undefined })
  })

  it('returns search results when search param is provided', async () => {
    mockSearchVideos.mockResolvedValue(mockVideos)

    const req = createGetRequest(
      'http://localhost:3000/api/videos?search=react',
    )
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(mockSearchVideos).toHaveBeenCalledWith('react')
  })

  it('filters by category when category param is provided', async () => {
    mockGetVideos.mockResolvedValue(mockVideos)

    const req = createGetRequest(
      'http://localhost:3000/api/videos?category=28&maxResults=5',
    )
    const res = await GET(req)

    expect(res.status).toBe(200)
    expect(mockGetVideos).toHaveBeenCalledWith({
      videoCategoryId: '28',
      maxResults: 5,
    })
  })

  it('uses maxResults without category', async () => {
    mockGetVideos.mockResolvedValue(mockVideos)

    const req = createGetRequest(
      'http://localhost:3000/api/videos?maxResults=10',
    )
    await GET(req)

    expect(mockGetVideos).toHaveBeenCalledWith({ maxResults: 10 })
  })

  it('returns 500 when service throws', async () => {
    mockGetVideos.mockRejectedValue(new Error('API down'))

    const req = createGetRequest('http://localhost:3000/api/videos')
    const res = await GET(req)

    expect(res.status).toBe(500)
    const body = await res.json()
    expect(body).toEqual({ error: 'Failed to fetch videos' })
  })
})

describe('POST /api/videos', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('authenticated session + valid FormData → calls uploadVideo → 200 with UploadedVideo', async () => {
    const session: SessionData = mockSession()
    mockGetSession.mockResolvedValue(session)

    const mockResult = {
      id: 'video-123',
      title: 'Test Video',
      description: 'A test video',
      privacy: 'public' as const,
      url: 'https://youtu.be/video-123',
    }
    mockUploadVideo.mockResolvedValue(mockResult)

    const formData = new FormData()
    formData.append('title', 'Test Video')
    formData.append('description', 'A test video')
    formData.append('privacy', 'public')
    formData.append(
      'file',
      new File([Buffer.alloc(1024)], 'video.mp4', { type: 'video/mp4' }),
    )

    const request = createPostRequest(formData)
    const response = await POST(request)

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body).toEqual(mockResult)
    expect(mockUploadVideo).toHaveBeenCalledWith(
      'mock-access-token',
      expect.any(File),
      'Test Video',
      'A test video',
      'public',
    )
  })

  it('no session → 401 Not authenticated', async () => {
    mockGetSession.mockResolvedValue(null)

    const formData = new FormData()
    const request = createPostRequest(formData)
    const response = await POST(request)

    expect(response.status).toBe(401)
    const body = await response.json()
    expect(body).toEqual({ error: 'Not authenticated' })
    expect(mockUploadVideo).not.toHaveBeenCalled()
  })

  it('authenticated + missing title → 400 Missing required fields', async () => {
    const session: SessionData = mockSession()
    mockGetSession.mockResolvedValue(session)

    const formData = new FormData()
    // No title - missing required field
    formData.append('privacy', 'public')
    formData.append(
      'file',
      new File([Buffer.alloc(1024)], 'video.mp4', { type: 'video/mp4' }),
    )

    const request = createPostRequest(formData)
    const response = await POST(request)

    expect(response.status).toBe(400)
    const body = await response.json()
    expect(body).toEqual({ error: 'Missing required fields' })
    expect(mockUploadVideo).not.toHaveBeenCalled()
  })

  it('uploadVideo throws → 500 Failed to upload video', async () => {
    const session: SessionData = mockSession()
    mockGetSession.mockResolvedValue(session)

    mockUploadVideo.mockRejectedValue(new Error('YouTube API error'))

    const formData = new FormData()
    formData.append('title', 'Test Video')
    formData.append('privacy', 'public')
    formData.append(
      'file',
      new File([Buffer.alloc(1024)], 'video.mp4', { type: 'video/mp4' }),
    )

    const request = createPostRequest(formData)
    const response = await POST(request)

    expect(response.status).toBe(500)
    const body = await response.json()
    expect(body).toEqual({ error: 'Failed to upload video' })
  })
})
