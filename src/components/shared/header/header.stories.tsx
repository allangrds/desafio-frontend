import type { Meta, StoryObj } from '@storybook/react'

import { Header } from './header'

const meta = {
  component: Header,
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSearch: (query) => console.log('Search:', query),
    onAddSearch: (query) => console.log('Add Search:', query),
    recentSearches: ['React', 'Next.js', 'TypeScript'],
  },
}
