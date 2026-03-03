'use client'

import { useRouter } from 'next/navigation'
import { useSearchHistoryStore } from '@/stores/search-history'

export const useSearch = () => {
  const router = useRouter()
  const { searches, addSearch } = useSearchHistoryStore()

  const onSearch = (query: string) =>
    router.push(`/results?search=${encodeURIComponent(query)}`)

  const onAddSearch = (query: string) => addSearch(query)

  return { onSearch, onAddSearch, recentSearches: searches }
}
