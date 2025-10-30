import { Header } from '@/components/shared/header'
import type { HeaderProps } from '@/components/shared/header'

type ResultsViewProps = {
  header: HeaderProps
  searchResults: {
    Component: React.ReactNode
  }
}

export const ResultsView = ({ header, searchResults }: ResultsViewProps) => {
  return (
    <>
      <Header
        onSearch={header.onSearch}
        onAddSearch={header.onAddSearch}
        initialQuery={header.initialQuery}
        recentSearches={header.recentSearches}
        SignInRegisterButtons={header.SignInRegisterButtons}
      />
      <main className="w-full py-10 flex flex-col gap-5 px-4 md:gap-7 md:px-20">
        {header.initialQuery && (
          <h1 className="text-xl font-bold md:text-2xl">
            Search results for "{header.initialQuery}"
          </h1>
        )}
        {searchResults.Component}
      </main>
    </>
  )
}
