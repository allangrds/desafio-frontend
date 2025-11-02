import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/session'

export const GET = async (request: NextRequest) => {
  await destroySession()

  return NextResponse.redirect(new URL('/', request.url))
}
