'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useSearchHistoryStore } from '@/stores/search-history.store'

export const useResultsLogic = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { searches, addSearch } = useSearchHistoryStore()

  const searchQuery = searchParams.get('search') || ''

  const onSearch = (query: string) => {
    router.push(`/results?search=${encodeURIComponent(query)}`)
  }

  const onAddSearch = (query: string) => {
    addSearch(query)
  }

  return {
    searchQuery,
    recentSearches: searches,
    onSearch,
    onAddSearch,
  }
}
