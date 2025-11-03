import { renderHook } from '@testing-library/react'
import { useRouter } from 'next/navigation'

import { useSearchHistoryStore } from '../../stores/search-history'

import { useHomeLogic } from './home.hooks'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('../../stores/search-history', () => ({
  useSearchHistoryStore: jest.fn(),
}))

describe('useHomeLogic', () => {
  const mockUseRouter = useRouter as jest.Mock
  const mockUseSearchHistoryStore =
    useSearchHistoryStore as unknown as jest.Mock
  const mockPush = jest.fn()
  const mockAddSearch = jest.fn()

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
    })
  })

  it('should return initialQuery and recentSearches as empty', () => {
    mockUseSearchHistoryStore.mockReturnValue({
      searches: ['react', 'typescript'],
      addSearch: mockAddSearch,
    })

    const { result } = renderHook(() => useHomeLogic())

    expect(result.current.initialQuery).toBe('')
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
