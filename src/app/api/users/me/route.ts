import { NextResponse } from 'next/server'

import { getSession } from '@/lib/session'

export const GET = async () => {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  return NextResponse.json({
    user: session.user,
    tokens: {
      accessToken: session.tokens.accessToken,
    },
  })
}
