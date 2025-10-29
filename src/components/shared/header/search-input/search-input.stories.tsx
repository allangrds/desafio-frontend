import type { Meta, StoryObj } from '@storybook/react'

import { SearchInput } from './search-input'

const meta = {
  title: 'Components/Header/SearchInput',
  component: SearchInput,
} satisfies Meta<typeof SearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSearch: (query) => console.log('Search:', query),
    onAddSearch: (query) => console.log('Add Search:', query),
    recentSearches: ['React', 'Next.js', 'TypeScript'],
  },
}
