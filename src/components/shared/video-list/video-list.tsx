import { VideoPreview } from '@/components/shared/video-preview'
import type { VideoPreviewProps } from '@/components/shared/video-preview'

export type VideoListProps = {
  videos: (VideoPreviewProps & { id: string })[]
}

export const VideoList = ({ videos }: VideoListProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoPreview
          key={video.id}
          title={video.title}
          thumbnailUrl={video.thumbnailUrl}
          channelName={video.channelName}
          views={video.views}
          duration={video.duration}
          href={video.href}
        />
      ))}
    </div>
  )
}
