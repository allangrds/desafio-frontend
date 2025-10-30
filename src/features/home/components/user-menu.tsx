const fetchRecentSearches = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return ['react', 'next.js', 'typescript']
}

export const UserMenu = async () => {
  const searches = await fetchRecentSearches()

  return (
    <div className="text-sm text-gray-600">Recentes: {searches.join(', ')}</div>
  )
}
