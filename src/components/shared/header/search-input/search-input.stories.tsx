import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { SearchInput } from './search-input'

const meta = {
  title: 'Components/Header/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
} satisfies Meta<typeof SearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSearch: fn(),
    onAddSearch: fn(),
    recentSearches: ['React', 'Next.js', 'TypeScript'],
  },
}

export const SubmitsSearch: Story = {
  args: {
    onSearch: fn(),
    onAddSearch: fn(),
    recentSearches: [],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox')
    await userEvent.type(input, 'react hooks')
    await userEvent.keyboard('{Enter}')
    await expect(args.onSearch).toHaveBeenCalledWith('react hooks')
  },
}

export const ValidationWithEmptyQuery: Story = {
  args: {
    onSearch: fn(),
    onAddSearch: fn(),
    recentSearches: [],
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const submitButton = canvas.getByRole('button', { name: /search/i })
    await userEvent.click(submitButton)
    await expect(args.onSearch).not.toHaveBeenCalled()
  },
}
