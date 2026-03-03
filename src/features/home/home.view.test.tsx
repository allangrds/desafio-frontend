import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { HomeView } from './home.view'

jest.mock('@/components/shared/header', () => ({
  Header: ({
    SignInRegisterButtons,
  }: {
    onSearch: (q: string) => void
    onAddSearch: (q: string) => void
    initialQuery: string
    recentSearches: string[]
    SignInRegisterButtons: React.ReactNode
  }) => (
    <header>
      <div data-testid="header-sign-in-buttons">{SignInRegisterButtons}</div>
    </header>
  ),
}))

const baseProps = {
  header: {
    onSearch: jest.fn(),
    onAddSearch: jest.fn(),
    initialQuery: '',
    recentSearches: [],
    SignInRegisterButtons: <div>Sign in</div>,
  },
  featuredVideos: { Component: <div data-testid="featured">Featured</div> },
  otherVideos: { Component: <div data-testid="other">Other</div> },
}

describe('HomeView', () => {
  it('renders featured videos section', () => {
    render(<HomeView {...baseProps} />)

    expect(screen.getByText('Featured videos')).toBeInTheDocument()
    expect(screen.getByTestId('featured')).toBeInTheDocument()
  })

  it('renders other videos section', () => {
    render(<HomeView {...baseProps} />)

    expect(screen.getByText('Other videos')).toBeInTheDocument()
    expect(screen.getByTestId('other')).toBeInTheDocument()
  })

  it('renders header with SignInRegisterButtons slot', () => {
    render(<HomeView {...baseProps} />)

    expect(screen.getByTestId('header-sign-in-buttons')).toBeInTheDocument()
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('falls back to empty array when recentSearches is undefined', () => {
    const props = {
      ...baseProps,
      header: {
        ...baseProps.header,
        recentSearches: undefined as unknown as string[],
      },
    }
    expect(() => render(<HomeView {...props} />)).not.toThrow()
  })
})
