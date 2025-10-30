import { renderHook } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useHomeLogic } from './home.hooks'
import { useSearchHistoryStore } from '../../stores/search-history.store'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock search history store
jest.mock('../../stores/search-history.store', () => ({
  useSearchHistoryStore: jest.fn(),
}))

describe('useHomeLogic', () => {
  const mockUseRouter = useRouter as jest.Mock
  const mockUseSearchHistoryStore =
    useSearchHistoryStore as unknown as jest.Mock
  const mockPush = jest.fn()
  const mockAddSearch = jest.fn()

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

  it('should return initialQuery as empty string', () => {
    const { result } = renderHook(() => useHomeLogic())

    expect(result.current.initialQuery).toBe('')
  })

  it('should return recent searches from store', () => {
    const { result } = renderHook(() => useHomeLogic())

    expect(result.current.recentSearches).toEqual(['react', 'typescript'])
  })

  it('should navigate to results page when onSearch is called', () => {
    const { result } = renderHook(() => useHomeLogic())

    result.current.onSearch('react hooks')

    expect(mockPush).toHaveBeenCalledWith('/results?search=react%20hooks')
  })

  it('should add search to history when onAddSearch is called', () => {
    const { result } = renderHook(() => useHomeLogic())

    result.current.onAddSearch('new search')

    expect(mockAddSearch).toHaveBeenCalledWith('new search')
  })

  it('should encode special characters in search query', () => {
    const { result } = renderHook(() => useHomeLogic())

    result.current.onSearch('react & hooks')

    expect(mockPush).toHaveBeenCalledWith('/results?search=react%20%26%20hooks')
  })
})
