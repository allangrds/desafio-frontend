import { Results } from '@/features/results'

type ResultsPageProps = {
  searchParams: Promise<{ search?: string }>
}

const ResultsPage = async ({ searchParams }: ResultsPageProps) => {
  const params = await searchParams
  const searchQuery = params.search || ''

  return <Results searchQuery={searchQuery} />
}

export default ResultsPage
