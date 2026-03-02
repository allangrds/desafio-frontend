import { NextResponse } from 'next/server'
import { scopes } from '@/constants/google'
import { oauth2ServerClient } from '@/lib/google-apis'

export const GET = () => {
  const authUrl = oauth2ServerClient.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  })

  return NextResponse.redirect(authUrl)
}
