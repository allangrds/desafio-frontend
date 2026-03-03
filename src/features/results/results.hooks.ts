'use client'

import { useSearchParams } from 'next/navigation'
import { useSearch } from '@/hooks/use-search'

export const useResultsLogic = () => {
  const searchParams = useSearchParams()
  const { onSearch, onAddSearch, recentSearches } = useSearch()

  return {
    searchQuery: searchParams.get('search') || '',
    recentSearches,
    onSearch,
    onAddSearch,
  }
}
