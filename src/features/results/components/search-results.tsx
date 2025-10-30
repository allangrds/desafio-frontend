import { VideoList } from '@/components/shared/video-list'
import { NoVideos } from '@/components/shared/no-videos'
import { searchVideos } from '@/services/youtube/youtube.service'

type SearchResultsProps = {
  searchQuery: string
}

export const SearchResults = async ({ searchQuery }: SearchResultsProps) => {
  try {
    const videos = await searchVideos(searchQuery)

    if (videos.length === 0) {
      return <NoVideos />
    }

    return <VideoList videos={videos} />
  } catch (error) {
    console.error('Error searching videos:', error)
    return <NoVideos />
  }
}
