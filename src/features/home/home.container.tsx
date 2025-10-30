'use client'

import { HomeView } from './home.view'
import { useHomeLogic } from './home.hooks'

type HomeContainerProps = {
  userMenuSlot: React.ReactNode
  featuredVideosSlot: React.ReactNode
  otherVideosSlot: React.ReactNode
}

export const HomeContainer = ({
  userMenuSlot,
  featuredVideosSlot,
  otherVideosSlot,
}: HomeContainerProps) => {
  const { initialQuery, recentSearches, onAddSearch, onSearch } = useHomeLogic()

  return (
    <HomeView
      header={{
        onSearch,
        onAddSearch,
        initialQuery,
        recentSearches,
        SignInRegisterButtons: userMenuSlot,
      }}
      featuredVideos={{
        Component: featuredVideosSlot,
      }}
      otherVideos={{
        Component: otherVideosSlot,
      }}
    />
  )
}
