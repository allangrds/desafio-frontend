import * as React from 'react'

import Link from 'next/link'

import { SearchInput } from './search-input'
import type { SearchBarProps } from './search-input'

export type HeaderProps = SearchBarProps & {
  SignInRegisterButtons: React.ReactNode
}

export const Header = ({
  onSearch,
  onAddSearch,
  initialQuery,
  recentSearches,
  SignInRegisterButtons,
}: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white py-10 flex flex-col gap-5 px-4 md:flex-row md:items-center md:justify-between md:gap-7 md:px-20">
      <div className="flex flex-row gap-7 items-center justify-between">
        <Link
          href="/"
          className="flex items-center text-3xl font-bold hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
        >
          <span className="text-black">You</span>
          <span className="text-red-600">Tube</span>
        </Link>
        <div className="h-10 w-full max-w-[200px] md:hidden">
          {SignInRegisterButtons}
        </div>
      </div>
      <SearchInput
        onSearch={onSearch}
        onAddSearch={onAddSearch}
        initialQuery={initialQuery}
        recentSearches={recentSearches}
      />
      <div className="hidden md:block md:h-10 md:w-full md:max-w-[200px]">
        {SignInRegisterButtons}
      </div>
    </header>
  )
}
