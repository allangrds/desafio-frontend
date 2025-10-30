import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ResultsContainer } from './results.container'
import { useResultsLogic } from './results.hooks'

// Mock do hook
jest.mock('./results.hooks', () => ({
  useResultsLogic: jest.fn(),
}))

// Mock do ResultsView
jest.mock('./results.view', () => ({
  ResultsView: ({ header, searchResults }: any) => (
    <div data-testid="results-view">
      <div data-testid="search-query">{header.initialQuery}</div>
      <div data-testid="search-results">{searchResults.Component}</div>
    </div>
  ),
}))

describe('ResultsContainer', () => {
  const mockUseResultsLogic = useResultsLogic as jest.Mock
  const mockOnSearch = jest.fn()
  const mockOnAddSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseResultsLogic.mockReturnValue({
      searchQuery: 'react hooks',
      recentSearches: ['react', 'typescript'],
      onSearch: mockOnSearch,
      onAddSearch: mockOnAddSearch,
    })
  })

  it('should render ResultsView with correct props', () => {
    const mockUserMenuSlot = <div>User Menu</div>
    const mockSearchResultsSlot = <div>Search Results</div>

    render(
      <ResultsContainer
        userMenuSlot={mockUserMenuSlot}
        searchResultsSlot={mockSearchResultsSlot}
      />,
    )

    expect(screen.getByTestId('results-view')).toBeInTheDocument()
  })

  it('should pass searchQuery to ResultsView', () => {
    const mockUserMenuSlot = <div>User Menu</div>
    const mockSearchResultsSlot = <div>Search Results</div>

    render(
      <ResultsContainer
        userMenuSlot={mockUserMenuSlot}
        searchResultsSlot={mockSearchResultsSlot}
      />,
    )

    expect(screen.getByTestId('search-query')).toHaveTextContent('react hooks')
  })

  it('should pass slots to ResultsView', () => {
    const mockUserMenuSlot = <div>User Menu Slot</div>
    const mockSearchResultsSlot = <div>Search Results Slot</div>

    render(
      <ResultsContainer
        userMenuSlot={mockUserMenuSlot}
        searchResultsSlot={mockSearchResultsSlot}
      />,
    )

    expect(screen.getByText('Search Results Slot')).toBeInTheDocument()
  })

  it('should use logic from useResultsLogic hook', () => {
    const mockUserMenuSlot = <div>User Menu</div>
    const mockSearchResultsSlot = <div>Search Results</div>

    render(
      <ResultsContainer
        userMenuSlot={mockUserMenuSlot}
        searchResultsSlot={mockSearchResultsSlot}
      />,
    )

    expect(mockUseResultsLogic).toHaveBeenCalled()
  })
})
