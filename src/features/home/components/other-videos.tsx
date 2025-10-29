import { VideoList } from '@/components/shared/video-list'
import { NoVideos } from '@/components/shared/no-videos'

const fetchFeaturedVideos = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000))

  return [
    {
      id: '1',
      title: 'Learn React in 2024',
      thumbnailUrl: 'https://img.youtube.com/vi/dGcsHMXbSOA/hqdefault.jpg',
      channelName: 'React Channel',
      views: 1000,
      duration: '10:00',
      href: 'https://www.youtube.com/watch?v=dGcsHMXbSOA',
    },
    {
      id: '2',
      title: 'Next.js Crash Course',
      thumbnailUrl: 'https://img.youtube.com/vi/mTz0GXj8NN0/hqdefault.jpg',
      channelName: 'Next.js Channel',
      views: 2500,
      duration: '15:30',
      href: 'https://www.youtube.com/watch?v=mTz0GXj8NN0',
    },
    {
      id: '3',
      title: 'TypeScript Basics',
      thumbnailUrl: 'https://img.youtube.com/vi/BwuLxPH8IDs/hqdefault.jpg',
      channelName: 'TypeScript Channel',
      views: 3000,
      duration: '12:45',
      href: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
    },
  ]
}

export const OtherVideos = async () => {
  const featuredVideos = await fetchFeaturedVideos()

  if (featuredVideos.length === 0) {
    return <NoVideos />
  }

  return <VideoList videos={featuredVideos} />
}
