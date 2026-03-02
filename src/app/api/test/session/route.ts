import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { destroySession, saveSession } from '@/lib/session'
import type { SessionData } from '@/types/auth'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const data: SessionData = await request.json()
  await saveSession(data)
  return NextResponse.json({ ok: true })
}

export const DELETE = async (): Promise<NextResponse> => {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await destroySession()
  return NextResponse.json({ ok: true })
}
