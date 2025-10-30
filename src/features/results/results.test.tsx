import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { Results } from './results'

// Mock ResultsContainer
jest.mock('./results.container', () => ({
  ResultsContainer: ({
    userMenuSlot,
    searchResultsSlot,
  }: {
    userMenuSlot: React.ReactNode
    searchResultsSlot: React.ReactNode
  }) => (
    <div data-testid="results-container">
      <div data-testid="user-menu-slot">{userMenuSlot}</div>
      <div data-testid="search-results-slot">{searchResultsSlot}</div>
    </div>
  ),
}))

// Mock components
jest.mock('./components/user-menu', () => ({
  UserMenu: () => <div>UserMenu</div>,
}))

jest.mock('./components/search-results', () => ({
  SearchResults: () => <div>SearchResults</div>,
}))

// Mock skeleton components
jest.mock(
  '../../components/shared/header/user-menu/user-menu-skeleton',
  () => ({
    UserMenuSkeleton: () => <div>UserMenuSkeleton</div>,
  }),
)

jest.mock('../../components/shared/video-list/video-list-skeleton', () => ({
  VideoListSkeleton: () => <div>VideoListSkeleton</div>,
}))

describe('Results', () => {
  it('should render ResultsContainer', () => {
    render(<Results searchQuery="react hooks" />)

    expect(screen.getByTestId('results-container')).toBeInTheDocument()
  })

  it('should render with Suspense boundaries for UserMenu', () => {
    render(<Results searchQuery="react hooks" />)

    expect(screen.getByTestId('user-menu-slot')).toBeInTheDocument()
  })

  it('should render with Suspense boundaries for SearchResults', () => {
    render(<Results searchQuery="react hooks" />)

    expect(screen.getByTestId('search-results-slot')).toBeInTheDocument()
  })
})
