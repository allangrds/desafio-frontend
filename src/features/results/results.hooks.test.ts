import { renderHook } from '@testing-library/react'
import { useSearchParams } from 'next/navigation'
import { useSearch } from '@/hooks/use-search'
import { useResultsLogic } from './results.hooks'

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}))

jest.mock('@/hooks/use-search', () => ({
  useSearch: jest.fn(),
}))

describe('useResultsLogic', () => {
  const mockUseSearchParams = useSearchParams as jest.Mock
  const mockUseSearch = useSearch as jest.Mock
  const mockOnSearch = jest.fn()
  const mockOnAddSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSearch.mockReturnValue({
      onSearch: mockOnSearch,
      onAddSearch: mockOnAddSearch,
      recentSearches: ['react', 'typescript'],
    })
  })

  it('should get search query from URL params', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('react hooks'),
    })

    const { result } = renderHook(() => useResultsLogic())

    expect(result.current.searchQuery).toBe('react hooks')
  })

  it('should return empty string when no search param', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    })

    const { result } = renderHook(() => useResultsLogic())

    expect(result.current.searchQuery).toBe('')
  })

  it('should return recentSearches from useSearch', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('test'),
    })

    const { result } = renderHook(() => useResultsLogic())

    expect(result.current.recentSearches).toEqual(['react', 'typescript'])
  })

  it('should delegate onAddSearch to useSearch', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('test'),
    })

    const { result } = renderHook(() => useResultsLogic())

    result.current.onAddSearch('new search')

    expect(mockOnAddSearch).toHaveBeenCalledWith('new search')
  })

  it('should delegate onSearch to useSearch', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('test'),
    })

    const { result } = renderHook(() => useResultsLogic())

    result.current.onSearch('query')

    expect(mockOnSearch).toHaveBeenCalledWith('query')
  })
})
