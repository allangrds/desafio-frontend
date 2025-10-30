'use client'

import * as React from 'react'

import { Search, Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export type SearchBarProps = {
  onSearch: (query: string) => void
  onAddSearch: (query: string) => void
  initialQuery?: string
  recentSearches?: string[]
}

export const SearchInput = ({
  onSearch,
  onAddSearch,
  initialQuery = '',
  recentSearches = [],
}: SearchBarProps) => {
  const [query, setQuery] = React.useState(initialQuery)
  const [showHistory, setShowHistory] = React.useState(false)

  React.useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (query?.trim()) {
      setShowHistory(false)
      onAddSearch(query.trim())
      onSearch(query.trim())
    }
  }

  const handleOnHistoryItemClick = (searchQuery: string) => () => {
    setQuery(searchQuery)
    setShowHistory(false)
    onSearch(searchQuery)
    onAddSearch(searchQuery)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }
  const handleOnFocus = () => {
    if (recentSearches && recentSearches.length > 0) {
      setShowHistory(true)
    }
  }
  const handleOnBlur = () => {
    if (showHistory) {
      setTimeout(() => setShowHistory(false), 150)
    }
  }

  return (
    <div className="relative w-full max-w-2xl">
      {/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
      <form
        onSubmit={handleOnSubmit}
        className="flex items-center gap-0 w-full"
        role="search"
      >
        <Input
          className="flex-1 rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:border-gray-300"
          type="search"
          placeholder="Search"
          value={query}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          aria-label="Search"
          aria-expanded={showHistory}
          aria-controls="search-history-list"
          autoComplete="off"
        />
        <Button
          type="submit"
          variant="outline"
          size="icon"
          className="rounded-l-none border-l-0 h-9 cursor-pointer"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </Button>
      </form>

      {showHistory && recentSearches && recentSearches.length > 0 && (
        <div
          id="search-history-list"
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
          role="listbox"
          aria-label="Recent searches"
        >
          {recentSearches.map((searchQuery) => (
            <button
              key={searchQuery}
              type="button"
              onClick={handleOnHistoryItemClick(searchQuery)}
              className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors first:rounded-t-md last:rounded-b-md"
              role="option"
              aria-selected={query === searchQuery}
            >
              <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
              <span className="flex-1 text-sm text-gray-900 dark:text-gray-100 truncate">
                {searchQuery}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
