import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_SEARCHES = 5

type SearchHistoryState = {
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
          // Remove duplicata se existir
          const filteredSearches = state.searches.filter(
            (search) => search !== trimmedQuery,
          )

          // Adiciona no início e limita a 5
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
