jest.mock('iron-session', () => ({ getIronSession: jest.fn() }))
jest.mock('next/headers', () => ({ cookies: jest.fn() }))

import { UserMenu as HomeUserMenu } from '@/features/home/components/user-menu'
import { UserMenu } from './user-menu'

describe('results/components/user-menu', () => {
  it('re-exports UserMenu from home components', () => {
    expect(UserMenu).toBe(HomeUserMenu)
  })
})
