import * as React from 'react'

import { UserMenuSkeleton } from '@/components/shared/header/user-menu/user-menu-skeleton'
import { VideoListSkeleton } from '@/components/shared/video-list/video-list-skeleton'
import { FeaturedVideos } from './components/featured-videos'
import { OtherVideos } from './components/other-videos'
import { UserMenu } from './components/user-menu'
import { HomeContainer } from './home.container'

export const Home = () => {
  return (
    <HomeContainer
      userMenuSlot={
        <React.Suspense fallback={<UserMenuSkeleton />}>
          <UserMenu />
        </React.Suspense>
      }
      featuredVideosSlot={
        <React.Suspense fallback={<VideoListSkeleton quantity={3} />}>
          <FeaturedVideos />
        </React.Suspense>
      }
      otherVideosSlot={
        <React.Suspense fallback={<VideoListSkeleton quantity={6} />}>
          <OtherVideos />
        </React.Suspense>
      }
    />
  )
}
