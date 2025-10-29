import { VideoList } from '@/components/shared/video-list'
import { NoVideos } from '@/components/shared/no-videos'
import { getVideos } from '@/services/youtube/youtube.service'

export const OtherVideos = async () => {
  try {
    const popularVideos = await getVideos({
      maxResults: 6,
    })

    if (popularVideos.length === 0) {
      return <NoVideos />
    }

    return <VideoList videos={popularVideos} />
  } catch (error) {
    console.error('Error fetching popular videos:', error)
    return <NoVideos />
  }
}
