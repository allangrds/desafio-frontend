'use client'

import { useResultsLogic } from './results.hooks'
import { ResultsView } from './results.view'

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
