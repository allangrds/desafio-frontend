import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SearchInput } from './search-input'

describe('SearchInput', () => {
  test('should renders search input and button', () => {
    const mockOnSearch = jest.fn()
    const mockOnAddSearch = jest.fn()

    render(
      <SearchInput onSearch={mockOnSearch} onAddSearch={mockOnAddSearch} />,
    )

    const input = screen.getByRole('searchbox') as HTMLInputElement
    expect(input).toBeDefined()
    expect(input.value).toBe('')
    expect(screen.getByRole('button', { name: /search/i })).toBeDefined()
  })

  test('should accepts text input', async () => {
    const mockOnSearch = jest.fn()
    const mockOnAddSearch = jest.fn()

    render(
      <SearchInput onSearch={mockOnSearch} onAddSearch={mockOnAddSearch} />,
    )

    const input = screen.getByRole('searchbox') as HTMLInputElement
    await userEvent.type(input, 'react tutorials')

    expect(input.value).toBe('react tutorials')
  })

  test('should calls onSearch and addSearch when form is submitted', async () => {
    const mockOnSearch = jest.fn()
    const mockOnAddSearch = jest.fn()

    render(
      <SearchInput onSearch={mockOnSearch} onAddSearch={mockOnAddSearch} />,
    )

    const input = screen.getByRole('searchbox') as HTMLInputElement
    await userEvent.type(input, 'next.js')
    await userEvent.type(input, '{enter}')

    expect(mockOnSearch).toHaveBeenCalledWith('next.js')
    expect(mockOnAddSearch).toHaveBeenCalledWith('next.js')
  })

  test('should not submit empty or whitespace-only queries', async () => {
    const mockOnSearch = jest.fn()
    const mockOnAddSearch = jest.fn()

    render(
      <SearchInput onSearch={mockOnSearch} onAddSearch={mockOnAddSearch} />,
    )

    const input = screen.getByRole('searchbox') as HTMLInputElement
    await userEvent.type(input, '  ')
    await userEvent.type(input, '{enter}')

    expect(mockOnSearch).not.toHaveBeenCalled()
    expect(mockOnAddSearch).not.toHaveBeenCalled()
  })

  test('should populates input with initialQuery prop', () => {
    const mockOnSearch = jest.fn()
    const mockOnAddSearch = jest.fn()
    const initialQuery = 'react tutorials'

    render(
      <SearchInput
        onSearch={mockOnSearch}
        onAddSearch={mockOnAddSearch}
        initialQuery={initialQuery}
      />,
    )

    const input = screen.getByRole('searchbox') as HTMLInputElement
    expect(input.value).toBe('react tutorials')
  })

  test('should updates input when initialQuery changes', () => {
    const mockOnSearch = jest.fn()
    const mockOnAddSearch = jest.fn()
    const initialQuery = 'react'
    const newInitialQuery = 'typescript'

    const { rerender } = render(
      <SearchInput
        onSearch={mockOnSearch}
        onAddSearch={mockOnAddSearch}
        initialQuery={initialQuery}
      />,
    )
    const input = screen.getByRole('searchbox') as HTMLInputElement
    expect(input.value).toBe('react')

    rerender(
      <SearchInput
        onSearch={mockOnSearch}
        onAddSearch={mockOnAddSearch}
        initialQuery={newInitialQuery}
      />,
    )
    expect(input.value).toBe('typescript')
  })

  describe('Search History Dropdown', () => {
    test('should display recent searches when input is focused', async () => {
      const mockOnSearch = jest.fn()
      const mockOnAddSearch = jest.fn()
      const recentSearches = ['react', 'next.js', 'typescript']

      render(
        <SearchInput
          onSearch={mockOnSearch}
          onAddSearch={mockOnAddSearch}
          recentSearches={recentSearches}
        />,
      )

      const input = screen.getByRole('searchbox') as HTMLInputElement
      await userEvent.click(input)

      const listbox = await screen.findByRole('listbox')
      expect(listbox).toBeDefined()
      expect(screen.getByRole('option', { name: 'react' })).toBeDefined()
      expect(screen.getByRole('option', { name: 'next.js' })).toBeDefined()
      expect(screen.getByRole('option', { name: 'typescript' })).toBeDefined()
    })

    test('should not show history dropdown when no history exists', () => {
      const mockOnSearch = jest.fn()
      const mockOnAddSearch = jest.fn()

      render(
        <SearchInput onSearch={mockOnSearch} onAddSearch={mockOnAddSearch} />,
      )

      const input = screen.getByRole('searchbox')
      fireEvent.focus(input)

      expect(screen.queryByRole('listbox')).toBeNull()
    })

    test('should hides history dropdown when clicking outside', async () => {
      const mockOnSearch = jest.fn()
      const mockOnAddSearch = jest.fn()
      const recentSearches = ['react', 'next.js', 'typescript']

      render(
        <div>
          <SearchInput
            onSearch={mockOnSearch}
            onAddSearch={mockOnAddSearch}
            recentSearches={recentSearches}
          />
          <div data-testid="outside">Outside</div>
        </div>,
      )

      // Focus input to show dropdown
      const input = screen.getByRole('searchbox')
      await userEvent.click(input)

      // Wait for dropdown to appear
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeDefined()
      })

      // Click outside to close dropdown
      const outside = screen.getByTestId('outside')
      await userEvent.click(outside)

      // Wait for dropdown to disappear
      await waitFor(
        () => {
          expect(screen.queryByRole('listbox')).toBeNull()
        },
        { timeout: 300 },
      )
    })

    test('should call onSearch and onAddSearch a when pressing Enter', async () => {
      const mockOnSearch = jest.fn()
      const mockOnAddSearch = jest.fn()
      const recentSearches = ['react', 'next.js', 'typescript']

      render(
        <SearchInput
          onSearch={mockOnSearch}
          onAddSearch={mockOnAddSearch}
          recentSearches={recentSearches}
        />,
      )

      // Focus input to show dropdown
      const input = screen.getByRole('searchbox')
      await userEvent.click(input)

      // Wait for dropdown to appear
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeDefined()
      })

      // Select a history item and click
      const option = screen.getByRole('option', { name: 'next.js' })
      await userEvent.click(option)

      expect(mockOnSearch).toHaveBeenCalledWith('next.js')
      expect(mockOnAddSearch).toHaveBeenCalledTimes(1)
      expect(mockOnAddSearch).toHaveBeenCalledWith('next.js')
      expect(mockOnAddSearch).toHaveBeenCalledTimes(1)

      // Focus input to show dropdown again
      await userEvent.click(input)

      // Wait for dropdown to appear
      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeDefined()

        // Select a history item and press Enter
        const option = screen.getByRole('option', { name: 'react' })
        option.focus()
      })

      await userEvent.keyboard('{enter}')

      expect(mockOnSearch).toHaveBeenCalledWith('react')
      expect(mockOnAddSearch).toHaveBeenCalledTimes(2)
      expect(mockOnAddSearch).toHaveBeenCalledWith('react')
      expect(mockOnAddSearch).toHaveBeenCalledTimes(2)
    })
  })
})
