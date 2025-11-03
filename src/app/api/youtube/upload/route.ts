import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getSession } from '@/lib/session'
import { uploadVideo } from '@/services/youtube/youtube.service'

import type { VideoPrivacy } from '@/types/youtube'

export const POST = async (request: NextRequest) => {
  try {
    const session = await getSession()

    if (!session || !session.tokens.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const privacy = formData.get('privacy') as VideoPrivacy
    const file = formData.get('file') as File

    if (!title || !privacy || !file) {
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
