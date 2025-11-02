import { google } from 'googleapis'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { oauth2ServerClient } from '@/lib/google-apis'
import { saveSession } from '@/lib/session'
import type { SessionData } from '@/types/auth'

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code provided' },
      { status: 400 },
    )
  }

  try {
    const { tokens } = await oauth2ServerClient.getToken(code)
    oauth2ServerClient.setCredentials(tokens)

    const oauth2 = google.oauth2({
      auth: oauth2ServerClient,
      version: 'v2',
    })

    const { data: userInfo } = await oauth2.userinfo.get()

    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2ServerClient,
    })

    const { data: channelData } = await youtube.channels.list({
      part: ['snippet'],
      mine: true,
    })

    const channelTitle =
      channelData.items && channelData.items.length > 0
        ? channelData.items[0].snippet?.title || 'My Channel'
        : 'My Channel'

    const sessionData: SessionData = {
      user: {
        name: userInfo.name || '',
        picture: userInfo.picture || '',
        email: userInfo.email || '',
        channelTitle,
      },
      tokens: {
        accessToken: tokens.access_token || '',
        refreshToken: tokens.refresh_token || undefined,
        expiryDate: tokens.expiry_date || undefined,
      },
    }

    await saveSession(sessionData)

    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error('Error during OAuth callback:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 },
    )
  }
}
