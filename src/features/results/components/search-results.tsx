import { NoVideos } from '@/components/shared/no-videos'
import { VideoList } from '@/components/shared/video-list'
import { getApiUrl } from '@/lib/api-url'
import type { Video } from '@/types/youtube'

type SearchResultsProps = {
  searchQuery: string
}

export const SearchResults = async ({ searchQuery }: SearchResultsProps) => {
  try {
    const response = await fetch(
      getApiUrl(`/api/videos?search=${encodeURIComponent(searchQuery)}`),
    )

    if (!response.ok) {
      throw new Error('Failed to search videos')
    }

    const videos: Video[] = await response.json()

    if (videos.length === 0) {
      return <NoVideos />
    }

    return <VideoList videos={videos} />
  } catch (error) {
    console.error('Error searching videos:', error)
    return <NoVideos />
  }
}
