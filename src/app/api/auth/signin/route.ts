import { NextResponse } from 'next/server'

import { oauth2ServerClient } from '@/lib/google-apis'
import { scopes } from '@/constants/google'

export const GET = () => {
  const authUrl = oauth2ServerClient.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  })

  return NextResponse.redirect(authUrl)
}
