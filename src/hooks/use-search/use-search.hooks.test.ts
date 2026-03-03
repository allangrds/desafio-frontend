import { renderHook } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useSearchHistoryStore } from '@/stores/search-history'
import { useSearch } from './use-search.hooks'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/stores/search-history', () => ({
  useSearchHistoryStore: jest.fn(),
}))

describe('useSearch', () => {
  const mockPush = jest.fn()
  const mockAddSearch = jest.fn()
  const mockUseRouter = useRouter as jest.Mock
  const mockUseSearchHistoryStore =
    useSearchHistoryStore as unknown as jest.Mock

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: mockPush })
    mockUseSearchHistoryStore.mockReturnValue({
      searches: ['react', 'typescript'],
      addSearch: mockAddSearch,
    })
  })

  it('onSearch calls router.push with encoded query', () => {
    const { result } = renderHook(() => useSearch())

    result.current.onSearch('react hooks')

    expect(mockPush).toHaveBeenCalledWith('/results?search=react%20hooks')
  })

  it('onSearch with special characters encodes correctly', () => {
    const { result } = renderHook(() => useSearch())

    result.current.onSearch('react & hooks')

    expect(mockPush).toHaveBeenCalledWith('/results?search=react%20%26%20hooks')
  })

  it('onAddSearch calls store addSearch', () => {
    const { result } = renderHook(() => useSearch())

    result.current.onAddSearch('new search')

    expect(mockAddSearch).toHaveBeenCalledWith('new search')
  })

  it('recentSearches reflects store searches array', () => {
    const { result } = renderHook(() => useSearch())

    expect(result.current.recentSearches).toEqual(['react', 'typescript'])
  })
})
