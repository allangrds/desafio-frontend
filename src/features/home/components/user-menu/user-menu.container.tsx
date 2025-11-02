'use client'

import { useRouter } from 'next/navigation'
import { UserMenu as UserMenuComponent } from '@/components/shared/header/user-menu/user-menu'
import type { User } from '@/types/auth'

type UserMenuClientProps = {
  user?: User
}

export const UserMenu = ({ user }: UserMenuClientProps) => {
  const router = useRouter()

  const handleSignIn = () => {
    router.push('/auth/signin')
  }

  const handleRegister = () => {
    router.push('/auth/register')
  }

  const handleLogout = () => {
    router.push('/auth/logout')
  }

  return (
    <UserMenuComponent
      user={user}
      onClickSignIn={handleSignIn}
      onClickRegister={handleRegister}
      onLogout={handleLogout}
    />
  )
}
