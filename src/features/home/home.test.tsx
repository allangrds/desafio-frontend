import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Home } from './home'

jest.mock('./components/featured-videos', () => ({
  FeaturedVideos: () => <div>FeaturedVideos</div>,
}))

jest.mock('./components/other-videos', () => ({
  OtherVideos: () => <div>OtherVideos</div>,
}))

jest.mock('./components/user-menu', () => ({
  UserMenu: () => <div>UserMenu</div>,
}))

jest.mock('./home.container', () => ({
  HomeContainer: ({
    userMenuSlot,
    featuredVideosSlot,
    otherVideosSlot,
  }: {
    userMenuSlot: React.ReactNode
    featuredVideosSlot: React.ReactNode
    otherVideosSlot: React.ReactNode
  }) => (
    <div>
      <div data-testid="user-menu-slot">{userMenuSlot}</div>
      <div data-testid="featured-videos-slot">{featuredVideosSlot}</div>
      <div data-testid="other-videos-slot">{otherVideosSlot}</div>
    </div>
  ),
}))

jest.mock('@/components/shared/header/user-menu/user-menu-skeleton', () => ({
  UserMenuSkeleton: () => <div>UserMenuSkeleton</div>,
}))

jest.mock('@/components/shared/video-list/video-list-skeleton', () => ({
  VideoListSkeleton: () => <div>VideoListSkeleton</div>,
}))

describe('Home', () => {
  it('renders HomeContainer with all three slots', () => {
    render(<Home />)

    expect(screen.getByTestId('user-menu-slot')).toBeInTheDocument()
    expect(screen.getByTestId('featured-videos-slot')).toBeInTheDocument()
    expect(screen.getByTestId('other-videos-slot')).toBeInTheDocument()
  })
})
