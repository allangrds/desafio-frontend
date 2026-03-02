import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { SESSION_OPTIONS } from '@/constants/session'
import type { SessionData } from '@/types/auth'

export const getSession = async (): Promise<SessionData | null> => {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookieStore,
    SESSION_OPTIONS,
  )

  if (!(session.user && session.tokens)) {
    return null
  }

  return {
    user: session.user,
    tokens: session.tokens,
  }
}

export const saveSession = async (data: SessionData): Promise<void> => {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookieStore,
    SESSION_OPTIONS,
  )

  session.user = data.user
  session.tokens = data.tokens

  await session.save()
}

export const destroySession = async (): Promise<void> => {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookieStore,
    SESSION_OPTIONS,
  )

  session.destroy()
}
