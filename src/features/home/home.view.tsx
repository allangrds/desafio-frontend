import { Header } from '@/components/shared/header/header'
import type { HeaderProps } from '@/components/shared/header/header'

type HomeViewProps = {
  header: HeaderProps
}

export const HomeView = ({ header }: HomeViewProps) => {
  return (
    <Header
      onSearch={header.onSearch}
      onAddSearch={header.onAddSearch}
      initialQuery={header.initialQuery}
      recentSearches={[]}
      SignInRegisterButtons={header.SignInRegisterButtons}
    />
  )
}
