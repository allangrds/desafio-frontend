import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import * as React from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { SESSION_OPTIONS } from '@/constants/session'
import type { SessionData } from '@/types/auth'
import { UserMenu } from './components/user-menu'
import { UploadContainer } from './upload.container'

const UploadSkeleton = () => (
  <div className="container mx-auto px-4 py-8 max-w-2xl">
    <Skeleton className="h-10 w-48 mb-8" />
    <Skeleton className="h-96 w-full" />
  </div>
)

const UserMenuSkeleton = () => (
  <div className="h-10 w-full max-w-[200px] flex items-center justify-end">
    <Skeleton className="h-10 w-10 rounded-full" />
  </div>
)

export const Upload = async () => {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(
    cookieStore,
    SESSION_OPTIONS,
  )

  if (!(session.user && session.tokens)) {
    redirect('/auth/signin')
  }

  const userMenuSlot = (
    <React.Suspense fallback={<UserMenuSkeleton />}>
      <UserMenu />
    </React.Suspense>
  )

  return (
    <React.Suspense fallback={<UploadSkeleton />}>
      <UploadContainer userMenuSlot={userMenuSlot} />
    </React.Suspense>
  )
}
