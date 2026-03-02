'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useSearchHistoryStore } from '@/stores/search-history'

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
