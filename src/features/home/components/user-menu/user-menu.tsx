import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

import { SESSION_OPTIONS } from '@/constants/session'
import type { SessionData } from '@/types/auth'

import { UserMenu as UserMenuContainer } from './user-menu.container'

export const UserMenu = async () => {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookieStore,
    SESSION_OPTIONS,
  )

  return <UserMenuContainer user={session.user} />
}
