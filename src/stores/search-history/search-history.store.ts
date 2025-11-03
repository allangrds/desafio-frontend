import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_SEARCHES = 5

export type SearchHistoryState = {
  searches: string[]
  addSearch: (query: string) => void
  clearHistory: () => void
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      searches: [],
      addSearch: (query: string) => {
        const trimmedQuery = query.trim()

        if (!trimmedQuery) {
          return
        }

        set((state) => {
          const filteredSearches = state.searches.filter(
            (search) => search !== trimmedQuery,
          )

          const newSearches = [trimmedQuery, ...filteredSearches].slice(
            0,
            MAX_SEARCHES,
          )

          return { searches: newSearches }
        })
      },
      clearHistory: () => set({ searches: [] }),
    }),
    {
      name: 'search-history-storage',
    },
  ),
)
