import { NoVideos } from '@/components/shared/no-videos'
import { VideoList } from '@/components/shared/video-list'
import { getApiUrl } from '@/lib/api-url'
import type { Video } from '@/types/youtube'

export const OtherVideos = async () => {
  try {
    const response = await fetch(getApiUrl('/api/videos?maxResults=6'))

    if (!response.ok) {
      throw new Error('Failed to fetch popular videos')
    }

    const popularVideos: Video[] = await response.json()

    if (popularVideos.length === 0) {
      return <NoVideos />
    }

    return <VideoList videos={popularVideos} />
  } catch (error) {
    console.error('Error fetching popular videos:', error)
    return <NoVideos />
  }
}
