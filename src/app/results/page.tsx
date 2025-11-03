import type { Metadata } from 'next'

import { Results } from '@/features/results'

type ResultsPageProps = {
  searchParams: Promise<{ search?: string }>
}

export const metadata: Metadata = {
  title: 'Search results | YouTube Clone',
  description: 'Search results for your query on YouTube',
}

const ResultsPage = async ({ searchParams }: ResultsPageProps) => {
  const params = await searchParams
  const searchQuery = params.search || ''

  return <Results searchQuery={searchQuery} />
}

export default ResultsPage
