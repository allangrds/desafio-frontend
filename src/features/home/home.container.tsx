'use client'

import { useHomeLogic } from './home.hooks'
import { HomeView } from './home.view'

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
