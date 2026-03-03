import { renderHook } from '@testing-library/react'
import { useSearch } from '@/hooks/use-search'
import { useHomeLogic } from './home.hooks'

jest.mock('@/hooks/use-search', () => ({
  useSearch: jest.fn(),
}))

describe('useHomeLogic', () => {
  const mockUseSearch = useSearch as jest.Mock
  const mockOnSearch = jest.fn()
  const mockOnAddSearch = jest.fn()

  beforeEach(() => {
    mockUseSearch.mockReturnValue({
      onSearch: mockOnSearch,
      onAddSearch: mockOnAddSearch,
      recentSearches: ['react', 'typescript'],
    })
  })

  it('should return initialQuery as empty string', () => {
    const { result } = renderHook(() => useHomeLogic())

    expect(result.current.initialQuery).toBe('')
  })

  it('should return recentSearches from useSearch', () => {
    const { result } = renderHook(() => useHomeLogic())

    expect(result.current.recentSearches).toEqual(['react', 'typescript'])
  })

  it('should delegate onSearch to useSearch', () => {
    const { result } = renderHook(() => useHomeLogic())

    result.current.onSearch('react hooks')

    expect(mockOnSearch).toHaveBeenCalledWith('react hooks')
  })

  it('should delegate onAddSearch to useSearch', () => {
    const { result } = renderHook(() => useHomeLogic())

    result.current.onAddSearch('new search')

    expect(mockOnAddSearch).toHaveBeenCalledWith('new search')
  })
})
