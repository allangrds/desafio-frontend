'use client'

import { useSearch } from '@/hooks/use-search'

export const useHomeLogic = () => {
  const { onSearch, onAddSearch, recentSearches } = useSearch()

  return {
    onSearch,
    onAddSearch,
    initialQuery: '',
    recentSearches,
  }
}
