import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

import type { SessionData } from '@/types/auth'
import { SESSION_OPTIONS } from '@/constants/session'

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookieStore,
    SESSION_OPTIONS,
  )

  if (!session.user || !session.tokens) {
    return null
  }

  return {
    user: session.user,
    tokens: session.tokens,
  }
}

export async function saveSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookieStore,
    SESSION_OPTIONS,
  )

  session.user = data.user
  session.tokens = data.tokens

  await session.save()
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookieStore,
    SESSION_OPTIONS,
  )

  session.destroy()
}
