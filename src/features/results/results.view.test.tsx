import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { ResultsView } from './results.view'

describe('ResultsView', () => {
  const defaultProps = {
    header: {
      onSearch: jest.fn(),
      onAddSearch: jest.fn(),
      initialQuery: 'react hooks',
      recentSearches: ['react', 'typescript'],
      SignInRegisterButtons: <div>Sign In</div>,
    },
    searchResults: {
      Component: <div>Search Results Content</div>,
    },
  }

  it('should render header with correct props', () => {
    render(<ResultsView {...defaultProps} />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /you tube/i })).toBeInTheDocument()
  })

  it('should render search results section', () => {
    render(<ResultsView {...defaultProps} />)

    const section = screen.getByRole('main')
    expect(section).toBeInTheDocument()
  })

  it('should render search results component', () => {
    render(<ResultsView {...defaultProps} />)

    expect(screen.getByText('Search Results Content')).toBeInTheDocument()
  })

  it('should display search query in title', () => {
    render(<ResultsView {...defaultProps} />)

    expect(
      screen.getByText(/Search results for "react hooks"/i),
    ).toBeInTheDocument()
  })

  it('should render with empty search query', () => {
    const props = {
      ...defaultProps,
      header: {
        ...defaultProps.header,
        initialQuery: '',
      },
    }

    render(<ResultsView {...props} />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
  })
})
