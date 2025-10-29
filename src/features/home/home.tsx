'use client'

import * as React from 'react'

import { UserMenuSkeleton } from '@/components/shared/header/user-menu/user-menu-skeleton'

import { HomeView } from './home.view'
import { useHomeLogic } from './home.hooks'

import { UserMenu } from './components/user-menu'

export const Home = () => {
  const { initialQuery, onAddSearch, onSearch } = useHomeLogic()

  return (
    <HomeView
      header={{
        onSearch,
        onAddSearch,
        initialQuery,
        SignInRegisterButtons: (
          <React.Suspense fallback={<UserMenuSkeleton />}>
            <UserMenu />
          </React.Suspense>
        ),
      }}
      // {...logic}
    />
  )
}
