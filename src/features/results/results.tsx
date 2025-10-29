import * as React from 'react'

import { UserMenuSkeleton } from '@/components/shared/header/user-menu/user-menu-skeleton'
import { VideoListSkeleton } from '@/components/shared/video-list/video-list-skeleton'

import { UserMenu } from './components/user-menu'
import { SearchResults } from './components/search-results'
import { ResultsContainer } from './results.container'

export type ResultsProps = {
  searchQuery: string
}

export const Results = ({ searchQuery }: ResultsProps) => (
  <ResultsContainer
    userMenuSlot={
      <React.Suspense fallback={<UserMenuSkeleton />}>
        <UserMenu />
      </React.Suspense>
    }
    searchResultsSlot={
      <React.Suspense fallback={<VideoListSkeleton quantity={10} />}>
        <SearchResults searchQuery={searchQuery} />
      </React.Suspense>
    }
  />
)
