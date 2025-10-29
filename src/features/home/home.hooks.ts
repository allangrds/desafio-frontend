'use client'

export const useHomeLogic = () => {
  const onSearch = (query: string) => {
    console.log('Search query:', query)
    // Aqui você pode adicionar navegação, analytics, etc
  }

  const onAddSearch = (query: string) => {
    console.log('Add to recent searches:', query)
    // Aqui você pode salvar no localStorage, API, etc
  }

  return {
    onSearch,
    onAddSearch,
    initialQuery: '',
  }
}
