import { VideoList } from '@/components/shared/video-list'
import { NoVideos } from '@/components/shared/no-videos'
import { getVideos } from '@/services/youtube/youtube.service'

export const FeaturedVideos = async () => {
  const featuredVideos = await getVideos({ videoCategoryId: '28' })

  if (featuredVideos.length === 0) {
    return <NoVideos />
  }

  return <VideoList videos={featuredVideos} />
}
