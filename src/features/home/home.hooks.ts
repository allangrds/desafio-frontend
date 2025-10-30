'use client'

import { useRouter } from 'next/navigation'
import { useSearchHistoryStore } from '@/stores/search-history.store'

export const useHomeLogic = () => {
  const router = useRouter()
  const { searches, addSearch } = useSearchHistoryStore()

  const onSearch = (query: string) => {
    router.push(`/results?search=${encodeURIComponent(query)}`)
  }

  const onAddSearch = (query: string) => {
    addSearch(query)
  }

  return {
    onSearch,
    onAddSearch,
    initialQuery: '',
    recentSearches: searches,
  }
}
