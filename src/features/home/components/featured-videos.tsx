import { NoVideos } from '@/components/shared/no-videos'
import { VideoList } from '@/components/shared/video-list'
import { getApiUrl } from '@/lib/api-url'
import type { Video } from '@/types/youtube'

export const FeaturedVideos = async () => {
  try {
    const response = await fetch(getApiUrl('/api/videos?category=28'))

    if (!response.ok) {
      throw new Error('Failed to fetch featured videos')
    }

    const featuredVideos: Video[] = await response.json()

    if (featuredVideos.length === 0) {
      return <NoVideos />
    }

    return <VideoList videos={featuredVideos} />
  } catch (error) {
    console.error('Error fetching featured videos:', error)
    return <NoVideos />
  }
}
