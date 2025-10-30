'use client'

import { ResultsView } from './results.view'
import { useResultsLogic } from './results.hooks'

type ResultsContainerProps = {
  userMenuSlot: React.ReactNode
  searchResultsSlot: React.ReactNode
}

export const ResultsContainer = ({
  userMenuSlot,
  searchResultsSlot,
}: ResultsContainerProps) => {
  const { searchQuery, recentSearches, onAddSearch, onSearch } =
    useResultsLogic()

  return (
    <ResultsView
      header={{
        onSearch,
        onAddSearch,
        initialQuery: searchQuery,
        recentSearches,
        SignInRegisterButtons: userMenuSlot,
      }}
      searchResults={{
        Component: searchResultsSlot,
      }}
    />
  )
}
