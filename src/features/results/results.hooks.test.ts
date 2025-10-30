import { renderHook } from '@testing-library/react'
import { useSearchParams, useRouter } from 'next/navigation'

import { useSearchHistoryStore } from '../../stores/search-history.store'

import { useResultsLogic } from './results.hooks'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
}))

// Mock search history store
jest.mock('../../stores/search-history.store', () => ({
  useSearchHistoryStore: jest.fn(),
}))

describe('useResultsLogic', () => {
  const mockUseSearchParams = useSearchParams as jest.Mock
  const mockUseRouter = useRouter as jest.Mock
  const mockUseSearchHistoryStore =
    useSearchHistoryStore as unknown as jest.Mock
  const mockAddSearch = jest.fn()
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
    })
    mockUseSearchHistoryStore.mockReturnValue({
      searches: ['react', 'typescript'],
      addSearch: mockAddSearch,
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

  it('should get recent searches from store', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('test'),
    })

    const { result } = renderHook(() => useResultsLogic())

    expect(result.current.recentSearches).toEqual(['react', 'typescript'])
  })

  it('should provide onAddSearch function', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('test'),
    })

    const { result } = renderHook(() => useResultsLogic())

    expect(result.current.onAddSearch).toBeDefined()
    expect(typeof result.current.onAddSearch).toBe('function')
  })

  it('should call addSearch from store when onAddSearch is called', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('test'),
    })

    const { result } = renderHook(() => useResultsLogic())

    result.current.onAddSearch('new search')

    expect(mockAddSearch).toHaveBeenCalledWith('new search')
  })

  it('should provide onSearch function', () => {
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockReturnValue('test'),
    })

    const { result } = renderHook(() => useResultsLogic())

    expect(result.current.onSearch).toBeDefined()
    expect(typeof result.current.onSearch).toBe('function')
  })
})
