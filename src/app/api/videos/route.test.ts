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
import { uploadVideo } from '@/services/youtube/youtube.service'
import type { SessionData } from '@/types/auth'
import { mockSession } from '@/test-utils/session'
import { POST } from './route'

const mockGetSession = getSession as jest.MockedFunction<typeof getSession>
const mockUploadVideo = uploadVideo as jest.MockedFunction<typeof uploadVideo>

const createPostRequest = (formData: FormData): NextRequest => {
  return new NextRequest('http://localhost:3000/api/videos', {
    method: 'POST',
    body: formData,
  })
}

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
