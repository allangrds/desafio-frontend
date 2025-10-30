import { renderHook, act } from '@testing-library/react'
import { useSearchHistoryStore } from './search-history.store'

describe('useSearchHistoryStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useSearchHistoryStore.setState({ searches: [] })
  })

  it('should start with empty searches', () => {
    const { result } = renderHook(() => useSearchHistoryStore())

    expect(result.current.searches).toEqual([])
  })

  it('should add a search to history', () => {
    const { result } = renderHook(() => useSearchHistoryStore())

    act(() => {
      result.current.addSearch('react hooks')
    })

    expect(result.current.searches).toEqual(['react hooks'])
  })

  it('should add searches to the beginning of the list', () => {
    const { result } = renderHook(() => useSearchHistoryStore())

    act(() => {
      result.current.addSearch('first search')
      result.current.addSearch('second search')
    })

    expect(result.current.searches).toEqual(['second search', 'first search'])
  })

  it('should not add duplicate searches', () => {
    const { result } = renderHook(() => useSearchHistoryStore())

    act(() => {
      result.current.addSearch('duplicate')
      result.current.addSearch('duplicate')
    })

    expect(result.current.searches).toEqual(['duplicate'])
  })

  it('should move existing search to the top when added again', () => {
    const { result } = renderHook(() => useSearchHistoryStore())

    act(() => {
      result.current.addSearch('first')
      result.current.addSearch('second')
      result.current.addSearch('third')
      result.current.addSearch('second')
    })

    expect(result.current.searches).toEqual(['second', 'third', 'first'])
  })

  it('should limit searches to 5 items', () => {
    const { result } = renderHook(() => useSearchHistoryStore())

    act(() => {
      result.current.addSearch('search1')
      result.current.addSearch('search2')
      result.current.addSearch('search3')
      result.current.addSearch('search4')
      result.current.addSearch('search5')
      result.current.addSearch('search6')
    })

    expect(result.current.searches).toHaveLength(5)
    expect(result.current.searches).toEqual([
      'search6',
      'search5',
      'search4',
      'search3',
      'search2',
    ])
  })

  it('should not add empty or whitespace-only searches', () => {
    const { result } = renderHook(() => useSearchHistoryStore())

    act(() => {
      result.current.addSearch('')
      result.current.addSearch('   ')
      result.current.addSearch('valid search')
    })

    expect(result.current.searches).toEqual(['valid search'])
  })

  it('should clear all searches', () => {
    const { result } = renderHook(() => useSearchHistoryStore())

    act(() => {
      result.current.addSearch('search1')
      result.current.addSearch('search2')
      result.current.clearHistory()
    })

    expect(result.current.searches).toEqual([])
  })

  it('should persist searches to localStorage', () => {
    const { result } = renderHook(() => useSearchHistoryStore())

    act(() => {
      result.current.addSearch('persisted search')
    })

    const stored = localStorage.getItem('search-history-storage')
    expect(stored).toBeTruthy()

    if (stored) {
      const parsed = JSON.parse(stored)
      expect(parsed.state.searches).toContain('persisted search')
    }
  })

  it('should load searches from localStorage on initialization', () => {
    // Limpa o estado atual
    useSearchHistoryStore.persist.clearStorage()

    const initialData = {
      state: { searches: ['loaded search'] },
      version: 0,
    }
    localStorage.setItem('search-history-storage', JSON.stringify(initialData))

    // Force rehydration
    useSearchHistoryStore.persist.rehydrate()

    const { result } = renderHook(() => useSearchHistoryStore())

    expect(result.current.searches).toEqual(['loaded search'])
  })
})
