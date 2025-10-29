import { Header } from '@/components/shared/header'
import type { HeaderProps } from '@/components/shared/header'

type HomeViewProps = {
  header: HeaderProps
  featuredVideos: {
    Component: React.ReactNode
  }
  otherVideos: {
    Component: React.ReactNode
  }
}

export const HomeView = ({
  header,
  featuredVideos,
  otherVideos,
}: HomeViewProps) => {
  return (
    <>
      <Header
        onSearch={header.onSearch}
        onAddSearch={header.onAddSearch}
        initialQuery={header.initialQuery}
        recentSearches={[]}
        SignInRegisterButtons={header.SignInRegisterButtons}
      />
      <section className="w-full py-10 flex flex-col gap-5 px-4 md:gap-7 md:px-20">
        <h2 className="text-xl font-bold md:text-2xl">Featured videos</h2>
        {featuredVideos.Component}
      </section>
      <section className="w-full py-10 flex flex-col gap-5 px-4 md:gap-7 md:px-20">
        <h2 className="text-xl font-bold md:text-2xl">Other videos</h2>
        {otherVideos.Component}
      </section>
    </>
  )
}
