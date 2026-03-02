import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getSession } from '@/lib/session'
import {
  getVideos,
  searchVideos,
  uploadVideo,
} from '@/services/youtube/youtube.service'

import type { VideoPrivacy } from '@/types/youtube'

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const maxResults = searchParams.get('maxResults')

    // biome-ignore lint/suspicious/noExplicitAny: YouTube API returns dynamic structure
    let videos: any

    if (search !== null) {
      videos = await searchVideos(search)
    } else if (category) {
      videos = await getVideos({
        videoCategoryId: category,
        maxResults: maxResults ? Number(maxResults) : undefined,
      })
    } else {
      videos = await getVideos({
        maxResults: maxResults ? Number(maxResults) : undefined,
      })
    }

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 },
    )
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const session = await getSession()

    if (!session?.tokens.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const privacy = formData.get('privacy') as VideoPrivacy
    const file = formData.get('file') as File

    if (!(title && privacy && file)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    const result = await uploadVideo(
      session.tokens.accessToken,
      file,
      title,
      description || '',
      privacy,
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 },
    )
  }
}
