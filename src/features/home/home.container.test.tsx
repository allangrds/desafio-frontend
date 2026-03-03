import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSearch } from '@/hooks/use-search'
import { HomeContainer } from './home.container'

jest.mock('@/hooks/use-search', () => ({
  useSearch: jest.fn(),
}))

jest.mock('./home.view', () => ({
  HomeView: ({
    header,
    featuredVideos,
    otherVideos,
  }: {
    header: { SignInRegisterButtons: React.ReactNode; initialQuery: string }
    featuredVideos: { Component: React.ReactNode }
    otherVideos: { Component: React.ReactNode }
  }) => (
    <div>
      <div data-testid="user-menu">{header.SignInRegisterButtons}</div>
      <div data-testid="initial-query">{header.initialQuery}</div>
      <div data-testid="featured">{featuredVideos.Component}</div>
      <div data-testid="other">{otherVideos.Component}</div>
    </div>
  ),
}))

describe('HomeContainer', () => {
  const mockUseSearch = useSearch as jest.Mock

  beforeEach(() => {
    mockUseSearch.mockReturnValue({
      onSearch: jest.fn(),
      onAddSearch: jest.fn(),
      recentSearches: [],
    })
  })

  it('renders slots into HomeView', () => {
    render(
      <HomeContainer
        userMenuSlot={<div>UserMenu</div>}
        featuredVideosSlot={<div>FeaturedVideos</div>}
        otherVideosSlot={<div>OtherVideos</div>}
      />,
    )

    expect(screen.getByTestId('user-menu')).toHaveTextContent('UserMenu')
    expect(screen.getByTestId('featured')).toHaveTextContent('FeaturedVideos')
    expect(screen.getByTestId('other')).toHaveTextContent('OtherVideos')
  })

  it('passes empty initialQuery to HomeView', () => {
    render(
      <HomeContainer
        userMenuSlot={<div />}
        featuredVideosSlot={<div />}
        otherVideosSlot={<div />}
      />,
    )

    expect(screen.getByTestId('initial-query')).toHaveTextContent('')
  })
})
