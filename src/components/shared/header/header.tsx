import Link from 'next/link'

import { SearchInput } from './search-input'
import type { SearchBarProps } from './search-input'

const SignInRegisterButtons = () => (
  <>
    <button>a</button>
    <button>b</button>
  </>
)

export type HeaderProps = SearchBarProps

export const Header = ({
  onSearch,
  onAddSearch,
  initialQuery,
  recentSearches,
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white py-10 px-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-7">
      <div className="flex flex-row gap-7 items-center justify-between">
        <Link
          href="/"
          className="flex items-center text-3xl font-bold hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
        >
          <span className="text-black">You</span>
          <span className="text-red-600">Tube</span>
        </Link>
        <div className="md:hidden">
          <SignInRegisterButtons />
        </div>
      </div>
      <SearchInput
        onSearch={onSearch}
        onAddSearch={onAddSearch}
        initialQuery={initialQuery}
        recentSearches={recentSearches}
      />
      <div className="hidden md:block">
        <SignInRegisterButtons />
      </div>
    </header>
  )
}
